
export const getCustomer = (order, customers) => {
    return customers.find(customer => customer.id === order.customerId);
};

export const getProduct = (productId, products) => {
    return products.find(product => product.id === productId);
};

export const getOrderDetails = (order, customers, products) => {
    const customer = getCustomer(order, customers);

    const items = order.items.map(item => {
        const product = getProduct(item.productId, products);

        if (!product) {
            return {
                nom: "Produit inconnu",
                categorie: "Inconnue",
                prix: 0,
                quantity: item.quantity,
                montant: 0
            };
        }

        return {
            ...product,
            quantity: item.quantity,
            montant: product.prix * item.quantity
        };
    });

    const total = items.reduce((somme, item) => somme + item.montant, 0);

    return {
        ...order,
        customer,
        items,
        total
    };
};

export const getFilteredOrders = (state) => {
    const search = state.search.trim().toLowerCase();

    return state.orders.filter(order => {
        const customer = getCustomer(order, state.customers);

        const nomComplet = customer
            ? `${customer.prenom} ${customer.nom}`.toLowerCase()
            : "";

        const matchesSearch = nomComplet.includes(search);

        const matchesStatus =
            state.status === "all" || order.statut === state.status;

        const matchesCategory =
            state.category === "all" ||
            order.items.some(item => {
                const product = getProduct(item.productId, state.products);
                return product && product.categorie === state.category;
            });

        return matchesSearch && matchesStatus && matchesCategory;
    });
};

export const getIndicators = (state) => {
    const totalAmount = state.orders.reduce((sum, order) => {
        const details = getOrderDetails(
            order,
            state.customers,
            state.products
        );
        return sum + details.total;
    }, 0);

    return {
        customers: state.customers.length,
        products: state.products.length,
        orders: state.orders.length,
        totalAmount
    };
};
