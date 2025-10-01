import React from 'react';

const DebugInfo = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const socketUrl = import.meta.env.VITE_SOCKET_URL;

  const styles = {
    padding: '40px',
    fontFamily: 'monospace',
    fontSize: '16px',
    lineHeight: '1.8',
  };

  return (
    <div style={styles}>
      <h1>Environment Variable Debug Info</h1>
      <p>This page shows the values as seen by the live Vercel application.</p>
      <hr />
      <div>
        <strong>VITE_API_BASE_URL:</strong>
        <pre><code>{apiBaseUrl || '--- UNDEFINED or NOT FOUND ---'}</code></pre>
      </div>
      <div>
        <strong>VITE_SOCKET_URL:</strong>
        <pre><code>{socketUrl || '--- UNDEFINED or NOT FOUND ---'}</code></pre>
      </div>
      <hr />
      <p>
        <strong>Next Step:</strong> Check these values against what you have set in the Vercel dashboard for the <strong>Production</strong> environment.
      </p>
    </div>
  );
};

export default DebugInfo;