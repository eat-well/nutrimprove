import AdminPanel from 'components/AdminPanel';
import SectionHeader from 'components/SectionHeader';
import React from 'react';

const sectionHeader = {
  title: 'Administration panel',
};

const AdminPanelPage = () => (
  <>
    <SectionHeader content={sectionHeader}/>
    <AdminPanel/>
  </>
);

export default AdminPanelPage;
