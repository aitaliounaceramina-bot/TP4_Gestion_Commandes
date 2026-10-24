
import {
    getIndicators,
    getOrderDetails,
    getCustomer
} from "./selectors.js";

const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-MA", {
        style: "currency",
        currency: "MAD",
        maximumFractionDigits: 2
    }).format(price);
};

const escapeHTML = (value) => {
    return String(value ?? "").replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
};

const getStatusClass = (status) => {
    if (status === "Livrée") return "status-livree";
    if (status === "Annulée") return "status-annulee";
    return "status-en-cours";
};

export const renderIndicators = (state) => {
    const indicators = getIndicators(state);

    const cards = [
        {
            title: "Nombre de clients",
            value: indicators.customers
        },
        {
            title: "Nombre de produits",
            value: indicators.products
        },
        {
            title: "Nombre de commandes",
            value: indicators.orders
        },
        {
            title: "Montant total des commandes",
            value: formatPrice(indicators.totalAmount)
        }
    ];

    document.getElementById("indicateurs").innerHTML = cards.map(card => `
        <div class="col-12 col-sm-6 col-lg-3">
            <div class="indicator-card">
                <h3>${escapeHTML(card.title)}</h3>
                <p class="indicator-value mb-0">
                    ${escapeHTML(card.value)}
                </p>
            </div>
        </div>
    `).join("");
};

export const renderOrders = (orders, state) => {
    const tbody = document.getElementById("commandes");

    document.getElementById("nombre-resultats").textContent =
        `${orders.length} commande(s) trouvée(s).`;

    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    Aucune commande trouvée.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = orders.map(order => {
        const customer = getCustomer(order, state.customers);
        const details = getOrderDetails(
            order,
            state.customers,
            state.products
        );

        const nomClient = customer
            ? `${customer.prenom} ${customer.nom}`
            : "Client inconnu";

        return `
            <tr>
                <td>#${escapeHTML(order.id)}</td>
                <td>${escapeHTML(nomClient)}</td>
                <td>${escapeHTML(order.date)}</td>
                <td>
                    <span class="status ${getStatusClass(order.statut)}">
                        ${escapeHTML(order.statut)}
                    </span>
                </td>
                <td>${escapeHTML(formatPrice(details.total))}</td>
                <td>
                    <button
                        class="btn btn-detail btn-sm"
                        data-order-id="${escapeHTML(order.id)}">
                        Voir détails
                    </button>
                </td>
            </tr>
        `;
    }).join("");
};

export const renderDetails = (order, state) => {
    const detailsContainer = document.getElementById("details");
    const section = document.getElementById("detailsSection");

    if (!order) {
        section.classList.add("d-none");
        detailsContainer.innerHTML = "";
        return;
    }

    const details = getOrderDetails(
        order,
        state.customers,
        state.products
    );

    const customer = details.customer;
    const nomClient = customer
        ? `${customer.prenom} ${customer.nom}`
        : "Client inconnu";

    const email = customer ? customer.email : "Non disponible";

    const rows = details.items.map(item => `
        <tr>
            <td>${escapeHTML(item.nom)}</td>
            <td>${escapeHTML(item.categorie)}</td>
            <td>${escapeHTML(formatPrice(item.prix))}</td>
            <td>${escapeHTML(item.quantity)}</td>
            <td>${escapeHTML(formatPrice(item.montant))}</td>
        </tr>
    `).join("");

    detailsContainer.innerHTML = `
        <h3>Commande #${escapeHTML(order.id)}</h3>

        <div class="row g-3 my-2">
            <div class="col-12 col-md-6">
                <p><strong>Client :</strong> ${escapeHTML(nomClient)}</p>
                <p><strong>Email :</strong> ${escapeHTML(email)}</p>
            </div>
            <div class="col-12 col-md-6">
                <p><strong>Date :</strong> ${escapeHTML(order.date)}</p>
                <p><strong>Statut :</strong> ${escapeHTML(order.statut)}</p>
            </div>
        </div>

        <h4 class="mt-3">Produits commandés</h4>

        <div class="table-responsive">
            <table class="table table-dark table-hover">
                <thead>
                    <tr>
                        <th>Produit</th>
                        <th>Catégorie</th>
                        <th>Prix unitaire</th>
                        <th>Quantité</th>
                        <th>Montant</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>

        <h4 class="text-end mt-3">
            Total : ${escapeHTML(formatPrice(details.total))}
        </h4>

        <button id="fermerDetails" class="btn btn-outline-light mt-2">
            Fermer les détails
        </button>
    `;

    section.classList.remove("d-none");
    section.scrollIntoView({ behavior: "smooth", block: "start" });
};

export const renderCategories = (products) => {
    const select = document.getElementById("filtreCategorie");

    const categories = [...new Set(
        products.map(product => product.categorie)
    )].sort();

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        select.appendChild(option);
    });
};

export const renderError = (message) => {
    const errorBox = document.getElementById("erreur");
    errorBox.textContent = message;
    errorBox.classList.remove("d-none");
};

export const clearError = () => {
    const errorBox = document.getElementById("erreur");
    errorBox.textContent = "";
    errorBox.classList.add("d-none");
};
