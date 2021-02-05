import React, { useState } from 'react';
import { Radio, RadioChangeEvent } from 'antd';
import FilterByName from './FilterByName';
import FilterByType from './FilterByType';

function FilterWrapper() {
  const [filterType, setFilterType] = useState<string>('byName');
  const onRadioChange = (e: RadioChangeEvent) => {
    setFilterType(e.target.value);
  };
  return (
    <>
      <div>
        <Radio.Group
          defaultValue='byName'
          buttonStyle='solid'
          onChange={onRadioChange}
        >
          <Radio.Button value='byName'>Name</Radio.Button>
          <Radio.Button value='byType'>Type</Radio.Button>
        </Radio.Group>
      </div>
      <div>
        {filterType === 'byName' && <FilterByName />}
        {filterType === 'byType' && <FilterByType />}
      </div>
    </>
  );
}

export default FilterWrapper;
