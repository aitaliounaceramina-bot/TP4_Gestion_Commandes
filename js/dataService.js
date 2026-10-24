
const loadJSON = async (url) => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status} lors du chargement de ${url}`);
    }

    return await response.json();
};

export const fetchData = async () => {
    try {
        const [customers, products, orders] = await Promise.all([
            loadJSON("./data/customers.json"),
            loadJSON("./data/products.json"),
            loadJSON("./data/orders.json")
        ]);

        if (
            !Array.isArray(customers) ||
            !Array.isArray(products) ||
            !Array.isArray(orders)
        ) {
            throw new Error("Les fichiers JSON doivent contenir des tableaux.");
        }

        return { customers, products, orders };

    } catch (error) {
        console.error("Erreur de chargement des données :", error);
        throw error;
    }
};
