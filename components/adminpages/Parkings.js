import React, { useState, useEffect } from 'react';
import DynamicTable from '../Tablecmp';
import Dynamicmodal from '../Modalcmp';
import CustomDangerAlert from '../Dangeralert';
import { CircularProgress } from "@heroui/react";

export default function Parkingsspace() {
  // Modal control
  const [isEditMode, setIsEditMode] = useState(false);
  const [CurrentEditItem, setCurrentEditItem] = useState(null);
  const [ModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Alert control
  const [showAlert, setShowAlert] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Table & form data
  const [parkingData, setParkingData] = useState([]);
  const [ParkingName, setParkingName] = useState("");
  const [Location, setLocation] = useState("");
  const [Taxpercentage, setTaxpercentage] = useState("");
  const [Taxname, setTaxname] = useState("");
  const [Status, setStatus] = useState("active");
  const [Space, setSpace] = useState("");
  const [StrikePrice, setStrikePrice] = useState("");
  const [AvailableFacilities, setAvailableFacilities] = useState("");
  const [Displaypicture, setDisplaypicture] = useState("");

  
  // Dynamic pricing tiers
  const [pricingTiers, setPricingTiers] = useState([
    { minDays: 1, maxDays: 3, basic: "", perDay: "" }
  ]);

  // Fetch locations
  const [LocationsData, setLocationsData] = useState([]);

  const columns = [
    { name: "PARKING NAME", uid: "ParkingName", selector: (row) => row.ParkingName },
    { name: "LOCATION", uid: "Location", selector: (row) => row.Location },
    { name: "STATUS", uid: "Status", selector: (row) => row.Status },
    { name: "SPACE", uid: "Space", selector: (row) => row.Space },
    { name: "ACTIONS", uid: "actions" },
  ];

  const statusOptions = {
    active: "success",
    inactive: "danger",
    pending: "warning",
  };

  // Add new pricing tier
  const addPricingTier = () => {
  if (pricingTiers.length === 0) {
    setPricingTiers([{ minDays: 1, maxDays: 3, basic: "", perDay: "" }]);
    return;
  }
  
  const lastTier = pricingTiers[pricingTiers.length - 1];
  const newMinDays = lastTier.maxDays + 1;
  setPricingTiers([
    ...pricingTiers,
    { 
      minDays: newMinDays, 
      maxDays: newMinDays,
      basic: "", 
      perDay: "" 
    }
  ]);
};

  // Remove pricing tier
  const removePricingTier = (index) => {
    if (pricingTiers.length <= 1) return;
    const newTiers = [...pricingTiers];
    newTiers.splice(index, 1);
    setPricingTiers(newTiers);
  };

  // Update pricing tier
  const updatePricingTier = (index, field, value) => {
    const newTiers = [...pricingTiers];
    newTiers[index] = { ...newTiers[index], [field]: value };
    setPricingTiers(newTiers);
  };

  const refreshTableData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/Parkingspace");
      if (!res.ok) throw new Error("Failed to fetch parking data.");
      const data = await res.json();
      setParkingData(data);
    } catch (err) {
      console.error("Error refreshing parking data:<br />", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshTableData();
  }, []);

  const resetForm = () => {
    setParkingName("");
    setLocation("");
    setTaxpercentage("");
    setTaxname("");
    setSpace("");
    setStrikePrice("");
    setAvailableFacilities("");
    setStatus("active");
    setIsEditMode(false);
    setModalOpen(false);
    setDisplaypicture("")
    setPricingTiers([{ minDays: 1, maxDays: 3, basic: "", perDay: "" }]);
  };

  const handleDelete = (item) => {
    if (!item?.id || !item?.Space) {
      console.error("Missing ID or Space key.<br />");
      return;
    }

    setItemToDelete(item);
    setShowAlert(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch('/api/Parkingspace', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemToDelete.id, Space: itemToDelete.Space }),
      });

      if (!res.ok) throw new Error('Failed to delete.<br />');

      await refreshTableData();
    } catch (error) {
      console.error('Error deleting parking space:<br />', error);
      alert('Failed to delete parking space.<br />');
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
        // Set pricing tiers
    if (item.pricingTiers && Array.isArray(item.pricingTiers)) {
      setPricingTiers(item.pricingTiers);
    } else {
      // Convert old format to new
      const tiers = [];
      if (item.pricingTiers?.under10) {
        tiers.push({ minDays: 0, maxDays: 10, ...item.pricingTiers.under10 });
      }
      if (item.pricingTiers?.under20) {
        tiers.push({ minDays: 10, maxDays: 20, ...item.pricingTiers.under20 });
      }
      if (item.pricingTiers?.under30) {
        tiers.push({ minDays: 20, maxDays: 30, ...item.pricingTiers.under30 });
      }
      if (item.pricingTiers?.over30) {
        tiers.push({ minDays: 30, maxDays: 100, ...item.pricingTiers.over30 });
      }
      setPricingTiers(tiers.length > 0 ? tiers : 
        [{ minDays: 1, maxDays: 3, basic: "", perDay: "" }]);
    }

    setParkingName(item.ParkingName || "");
    setLocation(item.Location || "");
    setTaxpercentage(Number(item.Taxpercentage) || "");
    setTaxname(item.Taxname || "");
    setSpace(Number(item.Space) || "");
    setStrikePrice(Number(item.StrikePrice) || "");
    setAvailableFacilities(item.AvailableFacilities || "");
    setDisplaypicture(item.Displaypicture)
    setStatus(item.Status || "active");
  };

  const modalInputs = [
    { label: "Parking Name", value: ParkingName, onChange: (e) => setParkingName(e.target.value), type: "text" },
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
    { label: "Tax Percentage", value: Taxpercentage, onChange: (e) => setTaxpercentage(e.target.value), type: "number" },
    { label: "Tax Name", value: Taxname, onChange: (e) => setTaxname(e.target.value), type: "text" },
    { label: "Available Space", value: Space, onChange: (e) => setSpace(e.target.value), type: "number" },
    { label: "Available Facilities", value: AvailableFacilities, onChange: (e) => setAvailableFacilities(e.target.value), type: "text" },
    { label: "Display Picture", value: Displaypicture, onChange: (e) => setDisplaypicture(e.target.value), type: "text" },
    {
      label: "Status", value: Status, onChange: setStatus, type: "autocomplete",
      options: [{ label: "Active", value: "active" }, { label: "Inactive", value: "inactive" }]
    },
        // Dynamic pricing section header
    {
      type: 'section',
      label: 'Pricing Tiers'
    }
  ];

  // Add dynamic pricing rows
  pricingTiers.forEach((tier, index) => {
    modalInputs.push({
      type: 'row',
      inputs: [
        {
          label: "Min Days",
          value: tier.minDays,
          onChange: (e) => {
            const newMin = parseInt(e.target.value) || 1;
            updatePricingTier(index, 'minDays', newMin);
            // Auto-update next tier's minDays if needed
            if (index < pricingTiers.length - 1 && newMin >= pricingTiers[index + 1].minDays) {
              updatePricingTier(index + 1, 'minDays', newMin + 1);
            }
          },
          type: "number",
          min: index === 0 ? 1 : (pricingTiers[index - 1]?.maxDays + 1 || 1)
        },
        {
          label: "Max Days",
          value: tier.maxDays,
          onChange: (e) => {
            const newMax = parseInt(e.target.value) || tier.minDays + 1;
            updatePricingTier(index, 'maxDays', Math.max(newMax, tier.minDays + 1));
          },
          type: "number",
          min: tier.minDays + 1
        },
        {
          label: "Basic Amount",
          value: tier.basic,
          onChange: (e) => updatePricingTier(index, 'basic', e.target.value),
          type: "number"
        },
        {
          label: "Per Day Rate",
          value: tier.perDay,
          onChange: (e) => updatePricingTier(index, 'perDay', e.target.value),
          type: "number"
        },
        {
          type: 'button',
          text: '-',
          color: 'danger',
          variant: 'flat',
          onClick: () => removePricingTier(index),
          disabled: pricingTiers.length <= 1
        }
      ]
    });
  });

  // Add "Add Row" button
  modalInputs.push({
    type: 'row',
    inputs: [
      {
        type: 'button',
        text: '+ Add Pricing Tier',
        color: 'primary',
        variant: 'flat',
        onClick: addPricingTier,
        fullWidth: true
      }
    ]
  });

  const modalButtons = [
    {
      text: "Close", color: "danger", variant: "flat", onClick: () => {
        resetForm();
        setModalOpen(false);
      }
    },
    {
      text: isEditMode ? "Update" : "Save", color: "primary", onClick: async () => {
        try {
          const parkingItem = {
            ...(isEditMode && { id: CurrentEditItem.id }),
            ParkingName,
            Location,
            pricingTiers: pricingTiers.map(tier => ({
              minDays: Number(tier.minDays),
              maxDays: Number(tier.maxDays),
              basic: Number(tier.basic),
              perDay: Number(tier.perDay)
            })),

            Price_per_hour: Number(pricingTiers.perHour),
            StrikePrice: Number(StrikePrice),
            Taxpercentage: Number(Taxpercentage),
            Taxname,
            Status,
            Space: Number(Space),
            AvailableFacilities,
            Displaypicture,
            updatedAt: new Date().toISOString()
          };

          if (!isEditMode) {
            const res = await fetch("/api/Parkingspace");
            const existingItems = await res.json();
            const numericIds = existingItems.map(item => parseInt(item.id)).filter(n => !isNaN(n));
            parkingItem.id = numericIds.length > 0 ? String(Math.max(...numericIds) + 1).padStart(2, '0') : "01";
            parkingItem.createdAt = new Date().toISOString();
          }

          const method = isEditMode ? 'PUT' : 'POST';
          const response = await fetch('/api/Parkingspace', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(parkingItem),
          });

          if (!response.ok) throw new Error('Failed to save.<br />');

          await refreshTableData();
          resetForm();
          setModalOpen(false);
        } catch (error) {
          console.error('Error:<br />', error);
          alert(`Operation failed:<br /> ${error.message}`);
        }
      }
    }
  ];

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

  return (
    <div>
      <div className='w-full flex justify-end p-4'>
        <Dynamicmodal
          triggerButton={{
            color: "primary",
            text: "Add New Parking Space",
            variant: "solid",
            onClick: () => { resetForm(); setIsEditMode(false); setModalOpen(true); }
          }}
          modalTitle={isEditMode ? "Edit Parking Space" : "Add New Parking Space"}
          inputs={modalInputs}
          buttons={modalButtons}
          showRememberMe={false}
          showForgotPassword={false}
          placement="top-center"
          ModalOpen={ModalOpen}
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
          data={parkingData}
          statusOptions={statusOptions}
          value="parkingspace"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {showAlert && itemToDelete && (
        <div className="fixed bottom-6 right-6 z-50 w-[300px]">
          <CustomDangerAlert
            title="Confirm Deletion"
            message={`Are you sure you want to delete parking space ${itemToDelete.ParkingName}?`}
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
