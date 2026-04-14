import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-900 selection:bg-indigo-200 selection:text-indigo-900">
      {/* Optionally a dedicated Admin Sidebar or Topbar could go here */}
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
