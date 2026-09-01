import { createApp, reactive } from "vue";
import App from "./App.vue";

import router from "./router";
import resourceManager from "../../../doppio/libs/resourceManager";
import call from "../../../doppio/libs/controllers/call";
import socket from "../../../doppio/libs/controllers/socket";
import Auth from "../../../doppio/libs/controllers/auth";
import { FrappeUI, setConfig, frappeRequest } from "frappe-ui";
import { installTrafficTracker } from "./utils/traffic";
import { vOutbound } from "./directives/vOutbound";
import "frappe-ui/style.css";
import "./style.css";

const app = createApp(App);
const auth = reactive(new Auth());

// Plugins
app.use(router);
app.use(resourceManager);
app.use(FrappeUI);

// Directives
// v-outbound: intercepts outbound <a> clicks, appends UTM params, strips Referer
app.directive("outbound", vOutbound);

setConfig("resourceFetcher", frappeRequest);

// Global Properties,
// components can inject this
app.provide("$auth", auth);
app.provide("$call", call);
app.provide("$socket", socket);

installTrafficTracker(router);

app.mount("#app");
