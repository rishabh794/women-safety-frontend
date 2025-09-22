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
    <form onSubmit={handleSave}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email (Optional)"
      />
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default EditGuardianForm;