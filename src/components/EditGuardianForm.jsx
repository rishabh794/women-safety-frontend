import React, { useState } from 'react';

const EditGuardianForm = ({ guardian, onSave, onCancel }) => {
  const [name, setName] = useState(guardian.name);
  const [phoneNumber, setPhoneNumber] = useState(guardian.phoneNumber);
  const [email, setEmail] = useState(guardian.email || '');

  const handleSave = (e) => {
    e.preventDefault();
    onSave(guardian.id, { name, phoneNumber, email });
  };

  return (
    <form 
      onSubmit={handleSave} 
      className="max-w-md mx-auto p-6 bg-gradient-to-br from-purple-500 to-orange-400 rounded-xl shadow-lg space-y-4"
    >
      <h2 className="text-2xl font-bold text-white text-center">Edit Guardian</h2>
      
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
         className="w-full p-3 rounded-md border border-white bg-white/30 placeholder-white text-white font-semibold focus:outline-none focus:ring-2 focus:ring-white"
        placeholder="Name"
      />
      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
        pattern="\+[1-9]\d{10,14}"
        title="Phone number must be in international format, e.g., +919876543210"
        className="w-full p-3 rounded-md border border-white bg-white/30 placeholder-white text-white font-semibold focus:outline-none focus:ring-2 focus:ring-white"
        placeholder="Phone Number"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email (Optional)"
       className="w-full p-3 rounded-md border border-white bg-white/30 placeholder-white text-white font-semibold focus:outline-none focus:ring-2 focus:ring-white"
      />
      
      <div className="flex justify-between gap-4">
        <button
          type="submit"
          className="flex-1 bg-white text-purple-700 font-semibold py-2 px-4 rounded-md hover:bg-white/90 transition"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-white/30 text-white font-semibold py-2 px-4 rounded-md hover:bg-white/50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default EditGuardianForm;
