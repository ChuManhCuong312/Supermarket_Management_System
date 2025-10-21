import React, { useEffect, useState } from "react";
import importApi from "../api/importApi";

const ImportForm = ({ selected, onSaved }) => {
    const [form, setForm] = useState({
        supplierId: "",
        importDate: "",
        totalAmount: "",
        status: "",
        note: "",
    });

    useEffect(() => {
        if (selected) setForm(selected);
    }, [selected]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selected) {
                await importApi.update(selected.id, form);
            } else {
                await importApi.create(form);
            }
            alert("Saved successfully!");
            onSaved();
            setForm({
                supplierId: "",
                importDate: "",
                totalAmount: "",
                status: "",
                note: "",
            });
        } catch (err) {
            alert("Failed to save import!");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <h3 className="text-lg font-semibold">
                {selected ? "Edit Import" : "Add New Import"}
            </h3>
            <input
                type="text"
                name="supplierId"
                placeholder="Supplier ID"
                value={form.supplierId}
                onChange={handleChange}
                className="border p-2 w-full"
            />
            <input
                type="date"
                name="importDate"
                value={form.importDate}
                onChange={handleChange}
                className="border p-2 w-full"
            />
            <input
                type="number"
                step="0.01"
                name="totalAmount"
                placeholder="Total Amount"
                value={form.totalAmount}
                onChange={handleChange}
                className="border p-2 w-full"
            />
            <input
                type="text"
                name="status"
                placeholder="Status"
                value={form.status}
                onChange={handleChange}
                className="border p-2 w-full"
            />
            <input
                type="text"
                name="note"
                placeholder="Note"
                value={form.note}
                onChange={handleChange}
                className="border p-2 w-full"
            />
            <button className="bg-green-600 text-white px-4 py-2 rounded">
                {selected ? "Update" : "Create"}
            </button>
        </form>
    );
};

export default ImportForm;
