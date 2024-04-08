import React, { useState, useEffect } from "react";
import axios from "axios";

export default function SearchWines() {
    const [searchTerm, setSearchTerm] = useState("");
    const [wineData, setWineData] = useState([]);
    const [filteredWines, setFilteredWines] = useState([]);
    

    useEffect(() => {
        async function fetchWineNames() {
            try {
                const response = await axios.get("https://winery-inventory-backend.vercel.app/wines");
                setWineData(response.data);
                setFilteredWines(response.data);
                console.log("wine data==>", wineData);
            } catch (error) {
                console.error("Error fetching wine names:", error);
            }
        }

        fetchWineNames();
    }, []);

    const handleSearch = (e) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);

        // Filter wine names based on search term
        const filtered = wineData.filter((wine) =>
            wine.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Update filtered wines
        setFilteredWines(filtered);
    };

    const handleQuantityChange = (name, value) => {
        const newWineData = [...wineData];
        const index = newWineData.findIndex((wine) => wine.name === name);
        if (index !== -1) {
            newWineData[index].quantity = value;
            setWineData(newWineData);
        }
    };

    const handleCmLevelChange = (name, value) => {
        const newWineData = [...wineData];
        const index = newWineData.findIndex((wine) => wine.name === name);
        if (index !== -1) {
            newWineData[index].cmLevel = value;
            setWineData(newWineData);
        }
    };

    const handleSaveRecords = async () => {
        console.log("Data to be saved:", wineData);
        try {
            const response = await axios.post(
                "https://winery-inventory-backend.vercel.app/records",
                wineData
            );
            console.log("response from server", response.data);
            // Clear inputs or perform any other necessary action
        } catch (error) {
            console.error("Error saving records:", error);
        }
    };
    return (
        <>
            <div className="p-2">
                {/* <input
                    type="text"
                    placeholder="Search Wine..."
                    value={searchTerm}
                    onChange={handleSearch}
                    required
                /> */}
                <input
                    type="search"
                    class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Search..."
                    onChange={handleSearch}
                    value={searchTerm}
                    required
                />
                <div className="mt-4">
                    {filteredWines.map((wine) => (
                        <div key={wine._id} className="flex items-center mb-4">
                            <div className="flex-1 mr-4">{wine.name}</div>
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={wine.quantity || ""}
                                onChange={(e) =>
                                    handleQuantityChange(
                                        wine.name,
                                        e.target.value
                                    )
                                }
                                className="w-1/3 px-4 py-2 border border-gray-300 rounded-md"
                            />
                            <input
                                type="number"
                                placeholder="cmLevel"
                                value={wine.cmLevel || ""}
                                onChange={(e) =>
                                    handleCmLevelChange(
                                        wine.name,
                                        e.target.value
                                    )
                                }
                                className="w-1/3 px-4 py-2 border border-gray-300 rounded-md"
                            />
                        </div>

                
                    ))}
                </div>
                <button className="fixed bottom-0 left-0 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={handleSaveRecords}>Save Records</button>
            </div>
        </>
    );
}
