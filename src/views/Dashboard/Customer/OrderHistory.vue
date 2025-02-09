<template>
  <div>
    <v-container>
      <v-row>
        <v-col>
          <v-dialog v-model="dialogInstruction" max-width="600px">
            <DNASampleSendingInstructions
              :specimenNumber="selectedSpeciment.number"
              :lab="selectedSpeciment.labData"
              hide-order-history-link
            >
              <template v-slot:button>
                <v-btn
                  depressed
                  color="primary"
                  large
                  width="100%"
                  @click="() => (dialogInstruction = false)"
                >
                  Dismiss
                </v-btn>
              </template>
            </DNASampleSendingInstructions>
          </v-dialog>
          <v-dialog v-model="dialogRejected" max-width="600px">
            <RejectedReasonDialog :specimen="selectedSpeciment">
              <template v-slot:button>
                <v-btn
                  depressed
                  color="primary"
                  large
                  width="100%"
                  @click="() => (dialogRejected = false)"
                >
                  Dismiss
                </v-btn>
              </template>
            </RejectedReasonDialog>
          </v-dialog>

          <DataTable
            :headers="headers"
            :items="orderHistory"
            :search="search"
            :sort-by="['timestamp']"
            :sort-desc="[true]"
            :loading="isLoading"
            additional-class="laporan-table"
          >
            <template v-slot:search-bar>
              <SearchBar
                label="Product Name, Status, Lab Name"
                @input="onSearchInput"
              ></SearchBar>
            </template>
            <template v-slot:[`item.dna_sample_tracking_id`]="{ item }">
              {{ item.dna_sample_tracking_id | specimenNumber }}
            </template>
            <template v-slot:[`item.timestamp`]="{ item }">
              {{ item.timestamp | timestampToDateTime }}
            </template>
            <template v-slot:[`item.status`]="{ item }">
              {{ item.status | customerSpecimenStatus }}
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <v-container v-if="item.status == SENDING">
                <v-btn
                  class="btn-sending"
                  dark
                  small
                  width="200"
                  @click="showDialogInstruction(item)"
                  >View Instructions</v-btn
                >
              </v-container>
              <v-container v-if="item.status == ORDER_PAID">
                <v-btn
                  class="Received"
                  dark
                  small
                  width="200"
                  @click="goToOrderDetail(item)"
                  >View Order</v-btn
                >
              </v-container>
              <v-container v-if="item.status == ORDER_UNPAID">
                <v-btn
                  class="btn-sending"
                  dark
                  small
                  width="200"
                  @click="goToOrderDetail(item)"
                  >Pay</v-btn
                >
              </v-container>
              <v-container v-if="item.status == SUCCESS">
                <v-btn
                  class="success"
                  small
                  width="200"
                  @click="gotoResult(item)"
                  >View Result</v-btn
                >
              </v-container>

              <v-container v-if="item.status == REJECTED">
                <v-btn
                  class="Reject"
                  dark
                  small
                  width="200"
                  @click="showDialogRejected(item)"
                  >View Reason</v-btn
                >
              </v-container>
            </template>

            <!-- Rows -->
          </DataTable>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { mapState } from "vuex";
import router from "@/router";
import DataTable from "@/components/DataTable";
import SearchBar from "@/components/DataTable/SearchBar";
import DNASampleSendingInstructions from "@/components/DNASampleSendingInstructions";
import RejectedReasonDialog from "@/components/RejectedReasonDialog";
import {
  SENDING,
  RECEIVED,
  SUCCESS,
  REJECTED,
  ORDER_UNPAID,
  ORDER_PAID,
  ORDER_FULFILLED,
  ORDER_REFUNDED,
} from "@/constants/specimen-status";
import {
  ordersByCustomer,
  getOrdersDetail,
} from "@/lib/polkadotProvider/query/orders";
import { queryLabsById } from "@/lib/polkadotProvider/query/labs";
import { queryServicesById } from "@/lib/polkadotProvider/query/services";

export default {
  name: "history-test",
  components: {
    DataTable,
    DNASampleSendingInstructions,
    SearchBar,
    RejectedReasonDialog,
  },
  data: () => ({
    SENDING,
    RECEIVED,
    SUCCESS,
    REJECTED,
    ORDER_UNPAID,
    ORDER_PAID,
    ORDER_FULFILLED,
    ORDER_REFUNDED,
    headers: [
      { text: "Lab Name", value: "labName" },
      { text: "Product Name", value: "title" },
      { text: "Specimen Number", value: "dna_sample_tracking_id" },
      { text: "Date", value: "timestamp" },
      { text: "Status", value: "status" },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
        align: "center",
        width: "5%",
      },
    ],
    speciments: [],
    selectedSpeciment: {},
    address: "",
    password: "",
    search: "",
    isLoading: false,
    dialogInstruction: false,
    dialogRejected: false,
    orderHistory: [],
  }),
  computed: {
    ...mapState({
      walletBalance: (state) => state.substrate.walletBalance,
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
    }),
  },
  watch: {
    async address() {
      await this.getOrderHistory();
    },
  },
  async mounted() {
    this.address = this.wallet.address;
  },
  methods: {
    async getOrderHistory() {
      this.isLoading = true;
      try {
        this.orderHistory = [];
        const listOrderId = await ordersByCustomer(this.api, this.address);

        var lengthMax = 3;
        if (listOrderId != null) {
          listOrderId.reverse();
          lengthMax = listOrderId.length;

          for (let i = 0; i < lengthMax; i++) {
            const detailOrder = await getOrdersDetail(this.api, listOrderId[i]);
            const detaillab = await queryLabsById(
              this.api,
              detailOrder.seller_id
            );
            const detailService = await queryServicesById(
              this.api,
              detailOrder.service_id
            );
            this.prepareOrderData(detailOrder, detaillab, detailService);
          }

          this.orderHistory.sort(
            (a, b) => parseInt(b.timestamp) - parseInt(a.timestamp)
          );
        }

        this.isLoading = false;
      } catch (err) {
        console.log(err);
        this.isLoading = false;
      }
    },
    prepareOrderData(detailOrder, detaillab, detailService) {
      const title = detailService.info.name;
      const labName = detaillab.info.name;
      let icon = "mdi-needle";
      if (detailService.info.image != null) {
        icon = detailService.info.image;
      }

      const number = detailOrder.id;
      const timestamp = (
        detailOrder.created_at.replace(/,/g, "") / 1000
      ).toString();
      const status = detailOrder.status;
      const dna_sample_tracking_id = detailOrder.dna_sample_tracking_id;

      const order = {
        icon,
        title,
        number,
        labName,
        timestamp,
        status,
        dna_sample_tracking_id,
      };

      this.orderHistory.push(order);
    },
    goToOrderDetail(item) {
      this.$router.push({
        name: "order-history-detail",
        params: { number: item.number },
      });
    },

    // Lama
    gotoResult(item) {
      router.push(`/result-test/${item.number}`);
    },
    showDialogInstruction(item) {
      this.dialogInstruction = true;
      this.selectedSpeciment = item;
    },
    showDialogRejected(item) {
      this.dialogRejected = true;
      this.selectedSpeciment = item;
    },
    onSearchInput(val) {
      this.search = val;
    },
  },
};
</script>

<style lang="scss">
@import "@/styles/variables.scss";

.btn-sending {
  background-color: $color-primary !important;
}

.Sending {
  background-color: $color-primary !important;
}

.Received {
  background-color: $color-status-received !important;
}

.Succes {
  background-color: $color-status-success !important;
}

.Reject {
  background-color: $color-status-reject !important;
}
</style>
