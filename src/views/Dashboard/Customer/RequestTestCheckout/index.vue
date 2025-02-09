<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" xl="6" lg="8" md="8">
          <v-card class="dg-card" elevation="0" outlined>
            <v-card-title class="px-8">
              <div class="text-h6">Selected Lab</div>
            </v-card-title>
            <v-card-text class="px-8">
              <template v-if="lab">
                <div class="text-subtitle-1">
                  <b>{{ lab.info.name }}</b>
                </div>
                <div class="text-body-2">
                  {{ lab.info.address }}
                </div>
                <div class="text-body-2">{{ city }}, {{ country }}</div>
              </template>
            </v-card-text>
            <div class="px-8">
              <v-divider></v-divider>
            </div>
            <v-card-title class="px-8">
              <div class="text-h6">Selected Products</div>
            </v-card-title>
            <v-card-text class="px-8">
              <div
                v-for="product in products"
                :key="product.serviceName"
                class="d-flex align-center fill-height mb-2"
              >
                <div class="my-3 ml-0">
                  <v-icon
                    v-if="
                      product.icon &&
                      (product.icon.startsWith('mdi') ||
                        product.icon.startsWith('$'))
                    "
                    color="#BA8DBB"
                    :size="48"
                  >
                    {{ product.icon }}
                  </v-icon>
                  <v-avatar v-else>
                    <img src="@/assets/degenics-logo.png" />
                  </v-avatar>
                </div>
                <div class="ml-5">
                  <div class="text-h6">
                    <b>{{ product.serviceName }}</b>
                  </div>
                  <div class="text-caption grey--text text--darken-1">
                    {{ product.serviceData.info.description }}
                  </div>
                </div>
                <v-spacer></v-spacer>
                <div class="align-self-end pb-2">
                  <span class="text-h6">
                    {{
                      parseFloat(product.price.replaceAll(",", ".")).toFixed(2)
                    }}
                  </span>
                  <span class="primary--text text-caption">
                    {{ coinName }}
                  </span>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" xl="3" lg="4" md="4">
          <v-card class="dg-card pb-3" elevation="0" outlined>
            <v-card-title class="px-8">
              <div class="text-h6">Order Summary</div>
            </v-card-title>
            <v-card-text class="px-8">
              <div class="d-flex justify-space-between">
                <div class="text-h6">Total Price</div>
                <div>
                  <span class="text-h6">
                    {{ totalPrice }}
                  </span>
                  <span class="primary--text text-caption">
                    {{ coinName }}
                  </span>
                </div>
              </div>
            </v-card-text>
            <v-card-actions class="px-8">
              <v-btn
                depressed
                color="primary"
                large
                width="100%"
                @click="onSubmitOrder"
              >
                Submit Order
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <SendPaymentDialog
      :show="sendPaymentDialog"
      :lab="lab"
      :products="products"
      :totalPrice="totalPrice"
      @toggle="sendPaymentDialog = $event"
      @payment-sent="onPaymentSent"
    ></SendPaymentDialog>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import SendPaymentDialog from "./SendPaymentDialog";
import cityData from "@/assets/json/city.json";

export default {
  components: {
    SendPaymentDialog,
  },
  data: () => ({
    sendPaymentDialog: false,
    country: "",
    city: "",
    coinName: "",
  }),
  computed: {
    ...mapState({
      lab: (state) => state.testRequest.lab,
      products: (state) => state.testRequest.products,
    }),
    totalPrice() {
      return this.products.reduce(
        (sum, { price }) =>
          (sum += parseFloat(price.replaceAll(",", "."))).toFixed(2),
        0
      );
    },
  },
  mounted() {
    this.coinName = process.env.VUE_APP_DEGENICS_USE_TOKEN_NAME;
    this.checkingData();
  },
  methods: {
    ...mapMutations({
      clearTestRequest: "testRequest/CLEAR_TEST_REQUEST",
    }),
    onSubmitOrder() {
      this.sendPaymentDialog = true;
    },
    onPaymentSent(receipts) {
      this.sendPaymentDialog = false;
      this.clearTestRequest();

      this.$router.push({ name: "request-test-receipt", params: { receipts } });

      console.log("Receipt in RequestTestCheckout", receipts);
    },
    checkingData() {
      if (this.lab == null) {
        this.$router.push({ name: "request-test" });
      } else {
        this.country = cityData[this.lab.info.country].name;
        this.city =
          cityData[this.lab.info.country].divisions[this.lab.info.city];
      }
    },
  },
};
</script>

<style>
</style>
