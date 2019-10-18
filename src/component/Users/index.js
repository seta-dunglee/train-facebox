import React from "react";
import { getAll } from "../../services/user";
import { Table } from "antd";
import { withRouter } from "react-router-dom";
import { PageHeader, Button, Descriptions } from "antd";

const columns = [
  {
    title: "ID",
    dataIndex: "id"
  },
  {
    title: "Name",
    dataIndex: "name"
  },
  {
    title: "Lasted train",
    dataIndex: "lasted_train"
  }
];

// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  },
  getCheckboxProps: record => ({
    disabled: record.name === "Disabled User", // Column configuration not to be checked
    name: record.name
  })
};

export default function Users({ history }) {
  const [users, setUsers] = React.useState([]);

  const onRowClick = row => {
    history.push(`/users/${row.id}`);
  };

  React.useEffect(() => {
    const init = async () => {
      let data= await getAll();
      setUsers(data.map(row => ({...row, key: row.id})));
    };
    init();
  }, []);

  const onAddUser = () => {
    history.push('/new');
  }

  return (
    <div>
      <div>
        <PageHeader
          ghost={false}
          title="Users List"
          subTitle="Users list has been trained"
          extra={[
            <Button key="3" type="primary" onClick={onAddUser}>Add User</Button>,
          ]}
          style={{paddingRight:0, paddingLeft:0}}
        >
        </PageHeader>
      </div>
      <Table
        bordered
        rowSelection={rowSelection}
        columns={columns}
        dataSource={users}
        onRowClick={onRowClick}
      />
    </div>
  );
}
