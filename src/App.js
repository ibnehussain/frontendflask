import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ emp_id: '', emp_name: '', emp_age: '' });
  const [selectedUser, setSelectedUser] = useState(null);


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      const transformedData = data.map((user) => {
        return {
          emp_id: user[0],
          emp_name: user[1],
          emp_age: user[2]
        };
      });
      setUsers(transformedData);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/insert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await response.json();
      console.log(data.message);
      setNewUser({ emp_id: '', emp_name: '', emp_age: '' });
      fetchUsers();
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, { method: 'DELETE' });
      const data = await response.json();
      console.log(data.message);
      fetchUsers();
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setNewUser(user);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/users/${selectedUser.emp_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const text = await response.text(); // Log the response text
      console.log('Response:', text);
      const data = JSON.parse(text); // Parse the response if it is valid JSON
      console.log(data.message);
      setSelectedUser(null);
      setNewUser({ emp_id: '', emp_name: '', emp_age: '' });
      fetchUsers();
    } catch (error) {
      console.log('Error:', error);
    }
  };
  

  return (
    <div className="App">
      <h1>User Management</h1>

      <h2>Add New User</h2>
      <form onSubmit={handleAddUser}>
        <input
          type="text"
          placeholder="Employee ID"
          name="emp_id"
          value={newUser.emp_id}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          placeholder="Employee Name"
          name="emp_name"
          value={newUser.emp_name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          placeholder="Employee Age"
          name="emp_age"
          value={newUser.emp_age}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add User</button>
      </form>

      <h2>List Users</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Emp_ID</th>
            <th>Emp_Name</th>
            <th>Emp_Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.emp_id || index}>
              <td>{index + 1}</td>
              <td>{user.emp_id}</td>
              <td>
                {selectedUser?.emp_id === user.emp_id ? (
                  <input
                    type="text"
                    name="emp_name"
                    value={newUser.emp_name}
                    onChange={handleInputChange}
                  />
                ) : (
                  user.emp_name
                )}
              </td>
              <td>
                {selectedUser?.emp_id === user.emp_id ? (
                  <input
                    type="text"
                    name="emp_age"
                    value={newUser.emp_age}
                    onChange={handleInputChange}
                  />
                ) : (
                  user.emp_age
                )}
              </td>
              <td>
                {selectedUser?.emp_id === user.emp_id ? (
                  <>
                    <button onClick={handleUpdateUser}>Save</button>
                    <button onClick={() => setSelectedUser(null)}>Cancel</button>
                  </>
                ) : (
                  <button onClick={() => handleEditUser(user)}>Edit</button>
                )}
                <button onClick={() => handleDeleteUser(user.emp_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default App;