import React from 'react';
import { useSelector } from 'react-redux';
function Spinner() {
  const loading = useSelector(state => state.auth.loading);

  return (
    <>
      {loading ? <div class="loader"></div>:
      <p>not loading properly!</p>

      } {/* You can style this loader */}
    </>
  );
}

export default Spinner;
