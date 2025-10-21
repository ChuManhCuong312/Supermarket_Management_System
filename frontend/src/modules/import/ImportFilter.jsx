import React, { useState } from "react";
import importApi from "../../api/importApi";

const ImportFilter = ({ onFilter }) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [minAmount, setMinAmount] = useState("");
    const [maxAmount, setMaxAmount] = useState("");

    const handleDateFilter = async () => {
        try {
            const res = await importApi.filterByDate(startDate, endDate, "asc");
            onFilter(res.data);
        } catch {
            alert("No imports found or invalid dates");
        }
    };

    const handleAmountFilter = async () => {
        try {
            const res = await importApi.filterByAmount(minAmount, maxAmount, "asc");
            onFilter(res.data);
        } catch {
            alert("No imports found or invalid amount range");
        }
    };

    return (
        <div className="border p-3 mb-3 rounded bg-gray-50">
            <h4 className="font-semibold mb-2">Filters</h4>

            {/* Filter by Date */}
            <div className="flex gap-2 mb-2">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border p-1"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border p-1"
                />
                <button
                    onClick={handleDateFilter}
                    className="bg-blue-600 text-white px-3 rounded"
                >
                    Filter by Date
                </button>
            </div>

            {/* Filter by Amount */}
            <div className="flex gap-2">
                <input
                    type="number"
                    placeholder="Min"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    className="border p-1"
                />
                <input
                    type="number"
                    placeholder="Max"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    className="border p-1"
                />
                <button
                    onClick={handleAmountFilter}
                    className="bg-blue-600 text-white px-3 rounded"
                >
                    Filter by Amount
                </button>
            </div>
        </div>
    );
};

export default ImportFilter;
