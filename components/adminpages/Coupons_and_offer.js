import React, { useState, useEffect } from 'react';
import DynamicTable from '../Tablecmp';
import Dynamicmodal from '../Modalcmp';
import CustomDangerAlert from '../Dangeralert';
import { CircularProgress } from "@heroui/react";

export default function CouponsAndOffers() {
  // Modal control
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Alert control
  const [showAlert, setShowAlert] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Form data
  const [type, setType] = useState("coupon");
  const [discountType, setDiscountType] = useState("percentage");
  const [value, setValue] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [targetAudience, setTargetAudience] = useState("all");
  const [couponCode, setCouponCode] = useState("");
  const [description, setDescription] = useState("");
  const [Location, setLocation] = useState("");
  const [LocationsData, setLocationsData] = useState([]);

  // Table data
  const [couponsData, setCouponsData] = useState([]);

  const columns = [
    { name: "TYPE", uid: "type" },
    { name: "Available Airports", uid: "Location" },
    { name: "DISCOUNT TYPE", uid: "discountType" },
    { name: "VALUE", uid: "value" },
    { name: "VALID FROM", uid: "fromDate" },
    { name: "VALID TO", uid: "toDate" },
    { name: "TARGET", uid: "targetAudience" },
    { name: "CODE", uid: "couponCode" },
    { name: "ACTIONS", uid: "actions" },
  ];

  const statusOptions = {
    active: "success",
    expired: "danger",
    upcoming: "warning",
  };

  const refreshTableData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/Couponsandoffers");
      if (!res.ok) throw new Error("Failed to fetch coupons data.");
      const data = await res.json();
      setCouponsData(data);
    } catch (err) {
      console.error("Error refreshing coupons data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTableData();
  }, []);

  const resetForm = () => {
    setType("coupon");
    setDiscountType("percentage");
    setValue("");
    setFromDate("");
    setToDate("");
    setTargetAudience("all");
    setCouponCode("");
    setDescription("");
    setIsEditMode(false);
    setModalOpen(false);
  };

  const handleDelete = (item) => {
    if (!item?.id) {
      alert("Missing coupon ID");
      return;
    }

    setItemToDelete(item);
    setShowAlert(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch('/api/Couponsandoffers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemToDelete.id }),
      });

      if (!res.ok) throw new Error('Failed to delete.');

      await refreshTableData();
    } catch (error) {
      alert('Failed to delete coupon.');
    } finally {
      setShowAlert(false);
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowAlert(false);
    setItemToDelete(null);
  };

  const handleEdit = (item) => {
    setCurrentEditItem(item);
    setIsEditMode(true);
    setModalOpen(true);

    setType(item.type || "coupon");
    setLocation(item.Location)
    setDiscountType(item.discountType || "percentage");
    setValue(item.value || "");
    setFromDate(item.fromDate || "");
    setToDate(item.toDate || "");
    setTargetAudience(item.targetAudience || "all");
    setCouponCode(item.couponCode || "");
    setDescription(item.description || "");
  };

  const fetchlocations = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/Locations");
        if (!res.ok) throw new Error("Failed to fetch locations data.<br />");
        const data = await res.json();
        setLocationsData(data);
      } catch (err) {
        console.error("Error fetching locations data:<br />", err);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchlocations();
    }, []);

  const modalInputs = [
    {
      label: "Type",
      value: type,
      onChange: setType,
      type: "autocomplete",
      options: [
        { label: "Coupon", value: "coupon" },
        { label: "Offer", value: "offer" }
      ]
    },
    {
      label: "Airport",
      value: Location,
      onChange: setLocation,
      type: "autocomplete",
      options: LocationsData.map(loc => ({
        label: loc.Airport_name,
        value: loc.Airport_name
      }))
    },
    {
      label: "Discount Type",
      value: discountType,
      onChange: setDiscountType,
      type: "autocomplete",
      options: [
        { label: "Percentage", value: "percentage" },
        { label: "Fixed Price", value: "fixed" }
      ]
    },
    { 
      label: "Value", 
      value: value, 
      onChange: (e) => setValue(e.target.value), 
      type: "text",
      placeholder: discountType === "percentage" ? "e.g., 10%" : "e.g., $20"
    },
    { 
      label: "Valid From", 
      value: fromDate, 
      onChange: (e) => setFromDate(e.target.value), 
      type: "datetime-local" 
    },
    { 
      label: "Valid To", 
      value: toDate, 
      onChange: (e) => setToDate(e.target.value), 
      type: "datetime-local" 
    },
    {
      label: "Target Audience",
      value: targetAudience,
      onChange: setTargetAudience,
      type: "autocomplete",
      options: [
        { label: "New Customers", value: "new" },
        { label: "Existing Customers", value: "existing" },
        { label: "All Customers", value: "all" }
      ]
    },
    ...(type === "coupon" ? [{
      label: "Coupon Code",
      value: couponCode,
      onChange: (e) => setCouponCode(e.target.value),
      type: "text",
      placeholder: "e.g., SUMMER20"
    }] : []),
    {
      label: "Description",
      value: description,
      onChange: (e) => setDescription(e.target.value),
      type: "textarea",
      placeholder: "Optional description"
    }
  ];

  const modalButtons = [
    {
      text: "Close", 
      color: "danger", 
      variant: "flat", 
      onClick: () => {
        resetForm();
        setModalOpen(false);
      }
    },
    {
      text: isEditMode ? "Update" : "Save", 
      color: "primary", 
      onClick: async () => {
        try {
          const couponItem = {
            ...(isEditMode && { id: currentEditItem.id }),
            type,
            Location,
            discountType,
            value,
            fromDate,
            toDate,
            targetAudience,
            description,
            updatedAt: new Date().toISOString()
          };

          if (type === "coupon") {
            couponItem.couponCode = couponCode;
          }

          if (!isEditMode) {
            const res = await fetch("/api/Couponsandoffers");
            const existingItems = await res.json();
            const numericIds = existingItems.map(item => parseInt(item.id)).filter(n => !isNaN(n));
            couponItem.id = numericIds.length > 0 ? String(Math.max(...numericIds) + 1) : "1";
            couponItem.createdAt = new Date().toISOString();
            couponItem.status = new Date(fromDate) > new Date() ? "upcoming" : 
                               new Date(toDate) < new Date() ? "expired" : "active";
          }

          const method = isEditMode ? 'PUT' : 'POST';
          const response = await fetch('/api/Couponsandoffers', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(couponItem),
          });

          if (!response.ok) throw new Error('Failed to save.');

          await refreshTableData();
          resetForm();
          setModalOpen(false);
        } catch (error) {
          console.error('Error:', error);
          alert(`Operation failed: ${error.message}`);
        }
      }
    }
  ];

  return (
    <div>
      <div className='w-full flex justify-end p-4'>
        <Dynamicmodal
          triggerButton={{
            color: "primary",
            text: "Add New Coupon/Offer",
            variant: "solid",
            onClick: () => { resetForm(); setIsEditMode(false); setModalOpen(true); }
          }}
          modalTitle={isEditMode ? "Edit Coupon/Offer" : "Add New Coupon/Offer"}
          inputs={modalInputs}
          buttons={modalButtons}
          showRememberMe={false}
          showForgotPassword={false}
          placement="top-center"
          ModalOpen={modalOpen}
          Editmode={isEditMode}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <CircularProgress
            color="success"
            formatOptions={{ style: "unit", unit: "kilometer" }}
            label="Loading..."
            showValueLabel={true}
            size="lg"
            value={100}
          />
        </div>
      ) : (
        <DynamicTable
          columns={columns}
          data={couponsData}
          statusOptions={statusOptions}
          value="coupons"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {showAlert && itemToDelete && (
        <div className="fixed bottom-6 right-6 z-50 w-[300px]">
          <CustomDangerAlert
            title="Confirm Deletion"
            message={`Are you sure you want to delete this ${itemToDelete.type}?`}
            button1Label="Delete it anyway"
            button2Label="Keep it"
            onButton1Click={confirmDelete}
            onButton2Click={cancelDelete}
          />
        </div>
      )}
    </div>
  );
}