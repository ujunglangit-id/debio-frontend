<template>
  <v-app>
    <!-- <v-app-bar app flat color="transparent" dense>
      <v-spacer></v-spacer>
      <SettingsMenu />
      <DevMenu v-if="isDevEnv" />
    </v-app-bar> -->
    <v-main class="login-main">
      <v-container fill-height>
        <div>
          <div class="d-flex justify-center">
            <!-- <a href="https://www.degenics.com/" target="_blank"> -->
            <v-img src="@/assets/degenics-logo-words.png" max-width="40%" />
            <!-- </a> -->
          </div>

          <div class="d-flex justify-center white--text text-lg-h6 mt-3">
            The Privacy-First Platform for Personal Genetic Testing
          </div>

          <div class="d-flex justify-center mt-10">
            <v-col lg="3" md="5" sm="8">
              <Button
                color="white"
                elevation="2"
                @click="onGenerateAccount"
                dark
              >
                <div class="primary--text">Create Account</div>
              </Button>
            </v-col>
            <v-col lg="3" md="5" sm="8">
              <Button @click="openSignIn" elevation="2" dark> Sign In </Button>
            </v-col>
          </div>
        </div>
      </v-container>

      <DialogSelectUserLogin
        :show="dialogSelectUserLogin"
        @toggle="dialogSelectUserLogin = $event"
        @forgot-password="
          ({ status, address }) => onUseMnemonic(status, address)
        "
        @key-store-set="successLoginAction"
        @show-mnemonic-form="showMnemonicForm"
      ></DialogSelectUserLogin>

      <GenerateAccountDialog
        :show="generateAccountDialog"
        @toggle="generateAccountDialog = $event"
        @terms-agreed="showSecretBackupPhraseDialog()"
      ></GenerateAccountDialog>

      <SecretBackupPhraseDialog
        :show="secretBackupPhraseDialog"
        :role="role"
        @toggle="secretBackupPhraseDialog = $event"
        @mnemonic-generated="
          ({ mnemonic, role }) => showVerifyRecoveryPhraseDialog(mnemonic, role)
        "
      ></SecretBackupPhraseDialog>

      <VerifyRecoveryPhraseDialog
        :show="verifyRecoveryPhraseDialog"
        :role="role"
        :mnemonic="mnemonic"
        @toggle="verifyRecoveryPhraseDialog = $event"
        @mnemonic-and-role="
          ({ mnemonic, role }) => showSetKeystorePasswordDialog(mnemonic, role)
        "
      ></VerifyRecoveryPhraseDialog>

      <SetKeystorePasswordDialog
        :secretType="secretType"
        :secret="secret"
        :show="setKeystorePasswordDialog"
        @toggle="setKeystorePasswordDialog = $event"
        @key-store-set="successLoginAction"
        @key-store-set-cancelled="clearSecret"
      ></SetKeystorePasswordDialog>

      <AccessAccountMnemonicDialog
        :show="accessAccountMnemonicDialog"
        @toggle="accessAccountMnemonicDialog = $event"
        @mnemonic-input="
          (mnemonic) =>
            checkForgotPassword(
              'accessAccountMnemonicDialog',
              'mnemonic',
              mnemonic
            )
        "
      ></AccessAccountMnemonicDialog>

      <AccessAccountMnemonicDialog
        :show="loginUsingMnemonicDialog"
        @toggle="accessAccountMnemonicDialog = $event"
        @mnemonic-input="({ mnemonic }) => showSetKeystorePasswordDialog(mnemonic)"
      ></AccessAccountMnemonicDialog>

      <DialogAlert
        :show="dialogAlert"
        :btnText="alertTextBtn"
        :textAlert="alertTextAlert"
        :imgPath="alertImgPath"
        :imgWidth="imgWidth"
        @toggle="dialogAlert = $event"
        @close="actionAlert()"
      ></DialogAlert>
    </v-main>
  </v-app>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
//import DevMenu from "@/components/DevMenu";
//import SettingsMenu from "@/components/SettingsMenu";
import Button from "@/components/Button";
import DialogSelectUserLogin from "@/components/DialogSelectUserLogin";
import GenerateAccountDialog from "@/components/GenerateAccountDialog";
import SecretBackupPhraseDialog from "@/components/SecretBackupPhraseDialog";
import SetKeystorePasswordDialog from "@/components/SetKeystorePasswordDialog";
import VerifyRecoveryPhraseDialog from "@/components/VerifyRecoveryPhraseDialog";
import AccessAccountMnemonicDialog from "@/components/AccessAccountMnemonicDialog";
import DialogAlert from "@/components/Dialog/DialogAlert";

export default {
  name: "Home",
  components: {
    Button,
    //DevMenu,
    //SettingsMenu,
    DialogSelectUserLogin,
    GenerateAccountDialog,
    SecretBackupPhraseDialog,
    SetKeystorePasswordDialog,
    VerifyRecoveryPhraseDialog,
    AccessAccountMnemonicDialog,
    DialogAlert,
  },
  computed: {
    isDevEnv() {
      return process.env.NODE_ENV == "development";
    },
  },
  data: () => ({
    role: "",
    secret: "",
    mnemonic: "",
    secretType: "",
    dialogSelectUserLogin: false,
    generateAccountDialog: false,
    secretBackupPhraseDialog: false,
    setKeystorePasswordDialog: false,
    verifyRecoveryPhraseDialog: false,
    accessAccountMnemonicDialog: false,
    loginUsingMnemonicDialog: false,
    forgotAddress: "",
    dialogAlert: false,
    alertTextBtn: "",
    alertImgPath: "warning.png",
    alertTextAlert: "",
    imgWidth: "50",
    successLogin: false,
    typelogin: "",
  }),
  methods: {
    ...mapActions({
      checkMnemonicSomeAddress: "substrate/checkMnemonicSomeAddress",
    }),
    ...mapMutations({}),
    onGenerateAccount() {
      this.generateAccountDialog = true;
      this.typelogin = "register";
    },
    onUseMnemonic(status, address) {
      if (status) {
        this.forgotAddress = address;
        this.accessAccountMnemonicDialog = true;
      }
    },
    showMnemonicForm() {
      this.loginUsingMnemonicDialog = true;
    },
    openSignIn() {
      this.dialogSelectUserLogin = true;
      this.typelogin = "login";
    },
    showSecretBackupPhraseDialog() {
      this.secretBackupPhraseDialog = true;
    },
    showVerifyRecoveryPhraseDialog(mnemonic, role) {
      this.mnemonic = mnemonic;
      this.role = role;
      this.verifyRecoveryPhraseDialog = true;
    },
    showSetKeystorePasswordDialog(mnemonic, role) {
      this.secret = mnemonic;
      this.secretType = "mnemonic";
      this.role = role;
      this.setKeystorePasswordDialog = true;
    },
    async checkForgotPassword(previousDialog, secretType, secret) {
      const result = await this.checkMnemonicSomeAddress({
        mnemonic: secret.mnemonic,
        accountAddress: this.forgotAddress,
      });

      if (result.success) {
        this.setKeyStorePassword(previousDialog, secretType, secret);
      } else {
        this.alertTextBtn = "OKE";
        this.alertImgPath = "warning.png";
        this.alertTextAlert =
          "forgot account password is not the same as mnemonic phrase.";
        this.dialogAlert = true;
      }
    },
    setKeyStorePassword(previousDialog, secretType, secret) {
      this.secretType = secretType; // mnemonic or privateKey
      this.secret = secret.mnemonic; // mnemonic or privateKey string
      this[previousDialog] = false; // Hide previous dialog
      this.setKeystorePasswordDialog = true;
    },
    clearSecret() {
      this.secretType = "";
      this.secret = "";
      this.successLogin = false;
      this.typelogin = "";
    },
    async actionAlert() {
      if (this.successLogin) {
        this.clearSecret();
        await this.$store.dispatch('substrate/connect')
        await this.$store.dispatch('substrate/getLabAccount')
        this.$router.push("/");
      } else {
        this.clearSecret();
      }
    },
    successLoginAction() {
      this.successLogin = true;
      this.alertTextBtn = "Continue";
      this.alertImgPath = "success.png";
      if (this.typelogin == "login") {
        this.alertTextAlert = "Login is successful";
      } else {
        this.alertTextAlert = "Register is successful";
      }
      this.dialogAlert = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.login-main {
  background: rgba(0, 0, 0, 0.5);
  background: linear-gradient(
    25deg,
    rgba(0, 0, 0, 1) 0%,
    rgba(63, 32, 64, 1) 24%,
    rgba(253, 192, 255, 1) 74%,
    rgba(255, 255, 255, 1) 96%
  );
}
.card-hover {
  border: 1px solid rgba(63, 32, 64, 0.5);
}
</style>
