import { useContext, useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Shield, User, Search } from 'lucide-react';
import axios, { AxiosError } from 'axios';
import { backendUrl } from '../App';
import { useAuth } from '../contexts/AuthContext';

const Users = () => {

  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    const [formData, setFormData] = useState({
    username: '',
   
    email: '',
    password : '',
     role: ''
  });


  const allUser=async ()=>{
    try {
      const res= await axios.get(`${backendUrl}user/allUser`)
     
      setUsers(res.data.users)
       const data= res.data.users;
  
    } catch (error) {
      console.log("user information error .....")
      
    }

  }
  useEffect(()=>{
 allUser()
 console.log(users)
  },[])

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user._id.toLowerCase().includes(searchTerm.toLowerCase()) 
    
  );

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
    console.log("edit user logic here",formData);
    console.log("edit user id",user ,editingUser);
  };

  const handleAdd =async (e) => {
  e.preventDefault();
   
   try {  const token = localStorage.getItem('token');
    console.log("Add user logic here",formData ,token);
     const res = await axios.post(`${backendUrl}user/register`,formData,{  headers: {
    Authorization: `Bearer ${token}`,
  },})
     
      console.log("Add user logic here  respoonse come",res);
     alert("User registered  ✅ ")
    setShowForm(false);
    allUser()
   } catch (error) {
if (error.response) {
      // The server responded with a status code out of 2xx range
      console.error('Error status:', error.response.status); // e.g. 400
     // console.error('Error message:', error.response.data.message); // custom error message from backend

      if (error.response.status === 400) {
        alert('Bad Request: ' + error.response.data.message);
      }
    }  if (error.response.status === 403) {
      // No response was received
      console.log("not valid user")
      alert(' ❌  Not Authrozied :' + error.response.data.message);
    } else {
      // Something else triggered the error
      console.error('Axios error:', error.message);
    }
     
   // console.log("User not add server isses")
    
   }
 
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  const handleDelete = (id) => {
    setShowDeleteConfirm(id);
  };


  const confirmDelete = async() => {
   // setUsers(prev => prev.filter(user => user.id !== showDeleteConfirm));
    // 
    try {
      let _id =showDeleteConfirm;
      console.log("confirmDelete",typeof _id)

       const res =await axios.delete(`${backendUrl}user/remove/${_id}`)
       console.log(res)
       setShowDeleteConfirm(null);
       allUser()
      
    } catch (error) {
      console.log("server error in confirmDelete")
      
    }
   
  };

  const toggleUserStatus = (id) => {
    setUsers(prev => prev.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const handleUpdate =async(e)=>{
     e.preventDefault();
     formData.email=editingUser.email
     console.log("Update user",formData)
     try {
       const res= await axios.put(`${backendUrl}user/edit/${editingUser._id}`,{formData})
        console.log(res)
        if(res.status === 200){
          alert(res.data.message)
        }
         setShowForm(false);
    allUser()
     } catch (error) {
      alert("user not updated ❌ ")
      
      console.log(error)
     }
  }

  const getRoleIcon = (role) => {
    return role === 'admin' ? Shield : User;
  };

  const getRoleColor = (role) => {
    return role === 'admin' ? 'text-purple-600 bg-purple-100' : 'text-blue-600 bg-blue-100';
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white  px-6 py-3 rounded-lg hover:bg-primary-600 transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <Plus size={20} />
            <span className="font-medium">Add User</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="text-sm text-gray-600 ml-4">
            {filteredUsers.length} user(s) found
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{users.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {users.filter(u => u.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Admin Users</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {users.filter(u => u.role === 'admin').length}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                
                <th className="px-6 py-3  text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const RoleIcon = getRoleIcon(user.role);
                return (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                          <span className=" font-medium">
                            {user.username.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium `}
                      >
       {user.username}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString()} 
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-indigo-600 hover:text-indigo-900 p-1"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          disabled={user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-0 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
              Delete User
            </h3>
            <p className="text-gray-600 text-center mb-6">
               {showDeleteConfirm} <br/>Are you sure you want to delete this user? This action cannot be undone and will remove all associated data.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Form Modal */}
      {showForm && (
      <div className="fixed inset-0 z-50   flex items-center justify-center p-4  bg-gray-100 bg-opacity-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h2>
              <form className="space-y-4" onSubmit={editingUser ? handleUpdate : handleAdd}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name 
                  </label>
                  <input
                    type="text"
                     name="username"
                   value={ formData.username}
                  onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    defaultValue={editingUser?.username}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                     name="email"
                 value={ editingUser? editingUser.email :formData.email}
                 onChange={handleChange}
                  readOnly ={editingUser}
                    className={ ` ${editingUser? ' bg-gray-200':'bg-white'} w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                    defaultValue={editingUser?.email}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="text"
                     name="password"
                 value={formData.password}
                 onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    defaultValue={editingUser?.password}
                  />
                </div>
              
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                 name="role"
            value={  formData.role}
            onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    defaultValue={editingUser?.role}
                  >  <option value="Choose user role ">Select role of user</option>
                    <option value="user">user</option>
                    <option value="developer">developer</option>
                    <option value="admin">admin</option>
                  </select>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingUser(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-primary-600"
                  >
                    {editingUser ? 'Update' : 'Create'} User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;