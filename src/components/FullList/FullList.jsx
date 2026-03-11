// src/components/FullList/FullList.jsx

import { useState } from "react";
import "./FullList.css";
import AddItemModal from "../Modals/AddItemModal/AddItemModal";
import ConfirmDeleteModal from "../Modals/ConfirmDeleteModal/ConfirmDeleteModal";

function FullList({
  items = [],
  setItems,
  activeStore,
  setActiveStore,
  stores,
  onAddItem,
  onDeleteItem,
}) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const handleAddItem = ({
    item,
    price,
    unit,
    category,
    priority,
    qty,
    hidden,
  }) => {
    onAddItem({
      item,
      category,
      priority,
      price,
      unit,
      qty: qty ?? 0,
      hidden: hidden ?? false,
      // store: activeStore,  /// REMOVE THIS
    }).then(() => {
      setIsAddOpen(false);
    });
  };

  const handleChange = (itemId, patch) => {
    setItems((prev) =>
      prev.map((row) => (row._id === itemId ? { ...row, ...patch } : row)),
    );
  };

  const handleSave = () => {
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const requestDelete = (row) => {
    setDeleteItem(row);
  };

  const closeDeleteModal = () => setDeleteItem(null);

  const confirmDelete = () => {
    if (!deleteItem) return;

    const itemId = deleteItem._id;
    onDeleteItem(itemId).then(() => {
      if (editingId === itemId) setEditingId(null);
      setDeleteItem(null);
    });
  };

  // Store Tabs
  return (
    <section className="full">
      <div className="full__tabs-wrap">
        <div className="full__tabs">
          {stores.map((store) => (
            <button
              key={store}
              type="button"
              className={`full__tab ${
                activeStore === store ? "full__tab_active" : ""
              } btn ${activeStore === store ? "btn--primary" : "btn--outline"}`}
              onClick={() => setActiveStore(store)}
            >
              {store}
            </button>
          ))}
        </div>

        {/* Add Item button */}
        <div className="full__additem-wrap">
          <button
            className="full__additem-btn btn btn--primary"
            type="button"
            onClick={() => setIsAddOpen(true)}
          >
            Add Item
          </button>
        </div>
      </div>

      {/* Items Header */}
      <div className="full__panel">
        <div className="full__header-row">
          <div className="full__col full__col_item">Item</div>
          <div className="full__col full__col_category">Category</div>
          <div className="full__col full__col_priority">Priority</div>
          <div className="full__col full__col_price">Price</div>
        </div>

        {/* Items Info */}
        <ul className="full__body">
          {items.map((row) => {
            const isEditing = row._id === editingId;

            return (
              <li key={row._id} className="full__row">
                {/* Top item/specs grid */}
                <div className="full__row-main">
                  {/* Item name */}
                  <div className="full__cell full__col_item">
                    {isEditing ? (
                      <input
                        className="full__input"
                        value={row.item}
                        onChange={(e) =>
                          handleChange(row._id, { item: e.target.value })
                        }
                      />
                    ) : (
                      <span>{row.item}</span>
                    )}
                  </div>

                  {/* Category */}
                  <div className="full__cell full__col_category">
                    {isEditing ? (
                      <select
                        className="full__select"
                        value={row.category}
                        onChange={(e) =>
                          handleChange(row._id, { category: e.target.value })
                        }
                      >
                        <option value="Pantry">Pantry</option>
                        <option value="Dairy">Dairy</option>
                        <option value="Meat">Meat</option>
                      </select>
                    ) : (
                      <span>{row.category}</span>
                    )}
                  </div>

                  {/* Priority */}
                  <div className="full__cell full__col_priority">
                    {isEditing ? (
                      <select
                        className="full__select"
                        value={row.priority}
                        onChange={(e) =>
                          handleChange(row._id, { priority: e.target.value })
                        }
                      >
                        <option value="Essential">Essential</option>
                        <option value="Surplus">Surplus</option>
                        <option value="Optional">Optional</option>
                      </select>
                    ) : (
                      <span>{row.priority}</span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="full__cell full__col_price">
                    {isEditing ? (
                      <div className="full__price-edit">
                        <input
                          className="full__input full__input_price"
                          type="number"
                          step="0.01"
                          value={row.price ?? 0}
                          onChange={(e) =>
                            handleChange(row._id, {
                              price: Number(e.target.value),
                            })
                          }
                        />
                        <span className="full__slash">/</span>
                        <select
                          className="full__select full__select_unit"
                          value={row.unit ?? "each"}
                          onChange={(e) =>
                            handleChange(row._id, { unit: e.target.value })
                          }
                        >
                          <option value="each">each</option>
                          <option value="lb">lb</option>
                          <option value="oz">oz</option>
                          <option value="g">g</option>
                          <option value="kg">kg</option>
                          <option value="dozen">dozen</option>
                          <option value="qt">qt</option>
                          <option value="gallon">gallon</option>
                          <option value="bag">bag</option>
                          <option value="box">box</option>
                        </select>
                      </div>
                    ) : (
                      <span className="full__price-text">
                        ${Number(row.price ?? 0).toFixed(2)}
                        {typeof row.unit === "string" && row.unit.trim()
                          ? ` / ${row.unit.trim()}`
                          : ""}
                      </span>
                    )}
                  </div>
                </div>

                {/* BOTTOM: actions bar */}
                <div className="full__row-actions">
                  <label className="full__hide">
                    <input
                      className="full__hide-input"
                      type="checkbox"
                      checked={!!row.hidden}
                      onChange={(e) =>
                        handleChange(row._id, { hidden: e.target.checked })
                      }
                    />
                    <span className="full__hide-text">Hide</span>
                  </label>

                  {isEditing ? (
                    <div className="full__actions">
                      <button
                        className="btn btn--primary btn--sm full__btnSmall"
                        type="button"
                        onClick={handleSave}
                      >
                        Save
                      </button>

                      <button
                        className="btn btn--outline btn--sm full__btnSmall"
                        type="button"
                        onClick={() => requestDelete(row)}
                      >
                        Delete
                      </button>

                      <button
                        className="btn btn--outline btn--sm full__btnSmall"
                        type="button"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn--outline btn--sm full__btnSmall"
                      type="button"
                      onClick={() => setEditingId(row._id)}
                    >
                      Edit
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="full__spacer" />
      </div>

      <AddItemModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddItem}
        store={activeStore}
      />

      <ConfirmDeleteModal
        isOpen={!!deleteItem}
        itemName={deleteItem?.item}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </section>
  );
}

export default FullList;
