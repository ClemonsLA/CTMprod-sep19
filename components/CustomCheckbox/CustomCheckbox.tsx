import React from 'react';

const CustomCheckbox = ({ value, checked, onChange }: {value:any, checked: any, onChange: any}) => {
  return (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{ display: 'none' }}
      />
      <span className={`custom-checkbox ${checked ? 'checked' : ''}`} />
      {value}
    </label>
  );
};

export default CustomCheckbox;