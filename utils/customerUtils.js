export const processCustomerData = async (customerData) => {
  if (!customerData?.CustomerEmail) {
    throw new Error('Customer email is required');
  }

  try {
    // Get ALL customers from API
    const response = await fetch('/api/Customerlist');
    if (!response.ok) throw new Error('Failed to fetch customers');
    
    const allCustomers = await response.json();

    // Find customer by email (case-insensitive)
    const existingCustomer = allCustomers.find(customer => 
      customer.CustomerEmail?.toLowerCase() === customerData.CustomerEmail.toLowerCase()
    );

    if (existingCustomer) {
      // Prepare updates
      const updates = {
        updatedAt: new Date().toISOString()
      };

      // Check each field for updates (ensure they are arrays)
      const fieldsToCheck = ['CustomerPhone', 'CarNumber', 'Airport', 'OrderId'];
      fieldsToCheck.forEach(field => {
        if (customerData[field]) {
          // Ensure existing field is an array, default to empty array if missing
          const existingValues = Array.isArray(existingCustomer[field]) ? existingCustomer[field] : [];
          
          // If the new value is not already in the array, add it
          if (!existingValues.includes(customerData[field])) {
            updates[field] = [...existingValues, customerData[field]];
          }
        }
      });

      // Only update if there are changes
      if (Object.keys(updates).length > 1) {
        const updateResponse = await fetch('/api/Customerlist', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: existingCustomer.id, // Ensure ID is passed
            ...updates
          })
        });
        if (!updateResponse.ok) throw new Error('Failed to update customer');
        return {
          customer: await updateResponse.json(),
          status: 'existing'
        };
      }
      
      // No updates needed
      return {
        customer: existingCustomer,
        status: 'existing'
      };
    } else {
      // Create new customer with required fields as arrays
      const newCustomer = {
        id: Date.now().toString(), // Auto-generate ID if not provided
        ParkingName: customerData.ParkingName,
        CustomerEmail: customerData.CustomerEmail,
        CustomerPhone: customerData.CustomerPhone ? [customerData.CustomerPhone] : [], // Ensure array
        CarNumber: customerData.CarNumber ? [customerData.CarNumber] : [], // Ensure array
        Airport: customerData.Airport ? [customerData.Airport] : [], // Ensure array
        OrderId: customerData.OrderId ? [customerData.OrderId] : [], // Ensure array
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const createResponse = await fetch('/api/Customerlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer)
      });
      if (!createResponse.ok) throw new Error('Failed to create customer');
      return {
        customer: await createResponse.json(),
        status: 'new'
      };
    }
  } catch (error) {
    console.error('Customer processing error:', error);
    throw error;
  }
};