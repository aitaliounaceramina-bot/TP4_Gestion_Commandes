
import { state } from "./state.js";
import { fetchData } from "./dataService.js";
import { getFilteredOrders } from "./selectors.js";

import {
    renderIndicators,
    renderOrders,
    renderDetails,
    renderCategories,
    renderError,
    clearError
} from "./view.js";

const render = () => {
    renderIndicators(state);

    const filteredOrders = getFilteredOrders(state);
    renderOrders(filteredOrders, state);

    if (state.selectedOrderId !== null) {
        const selectedOrder = state.orders.find(
            order => order.id === state.selectedOrderId
        );

        renderDetails(selectedOrder, state);
    }
};

const initEvents = () => {
    document.getElementById("recherche").addEventListener("input", event => {
        state.search = event.target.value;
        render();
    });

    document.getElementById("filtreStatut").addEventListener("change", event => {
        state.status = event.target.value;
        render();
    });

    document.getElementById("filtreCategorie").addEventListener("change", event => {
        state.category = event.target.value;
        render();
    });

    document.getElementById("reinitialiser").addEventListener("click", () => {
        state.search = "";
        state.status = "all";
        state.category = "all";
        state.selectedOrderId = null;

        document.getElementById("recherche").value = "";
        document.getElementById("filtreStatut").value = "all";
        document.getElementById("filtreCategorie").value = "all";

        renderDetails(null, state);
        render();
    });

    document.getElementById("commandes").addEventListener("click", event => {
        const button = event.target.closest("[data-order-id]");

        if (!button) return;

        state.selectedOrderId = Number(button.dataset.orderId);

        const order = state.orders.find(
            item => item.id === state.selectedOrderId
        );

        renderDetails(order, state);
    });

    document.getElementById("details").addEventListener("click", event => {
        if (event.target.id === "fermerDetails") {
            state.selectedOrderId = null;
            renderDetails(null, state);
        }
    });
};

const init = async () => {
    try {
        clearError();

        const data = await fetchData();

        state.customers = data.customers;
        state.products = data.products;
        state.orders = data.orders;

        renderCategories(state.products);
        initEvents();
        render();

    } catch (error) {
        renderError(
            "Impossible de charger les données. Vérifiez les fichiers JSON et relancez l'application avec Live Server."
        );

        console.error(error);
    }
};

init();
