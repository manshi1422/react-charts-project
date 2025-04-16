import React, { useState } from 'react';
import axios from 'axios';
const form = (props:any) => {
  
  
    
      const [formData, setFormData] = useState({
        id: '',
        name: '',
        data: ''
      });
    const [loading, setLoading]=useState(false);
      const handleChange = (e:any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };
    
      const handleSubmit = async (e:any) => {
        e.preventDefault();
        setLoading(true);
        try {
          const payload = {
            id: Number(formData.id),
            name: formData.name,
            data: formData.data // Ensure it's valid JSON
          };
    
          await axios.post('http://localhost:9091/api/products', payload);
          setLoading(false);
          props.getProducts();

          alert('Product added successfully!');
          setFormData({
            id: '',
            name: '',
            data: ''
          })
        } catch (error:any) {
          alert('Error adding product: ' + error.message);
          setLoading(false);
        }
      };
    
      return (
        <div style={{ border: '1px solid #ccc', padding: 16, marginBottom: 24 }}>
          <h2 style={{ fontSize: 20 }}>Add New Product</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 10 }}>
              <label>ID: </label><br />
              <input
                type="number"
                name="id"
                value={formData.id}
                onChange={handleChange}
                style={{ padding: 8, width: '97%' }}
                required
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Name: </label><br />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{ padding: 8, width: '97%' }}
                required
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Data (JSON): </label><br />
              <textarea
                name="data"
                value={formData.data}
                onChange={handleChange}
                placeholder='e.g. { "color": "Black", "capacity": "128 GB" }'
                style={{ padding: 8, width: '97%', height: 100 }}
                required
              />
            </div>
            <button type="submit" style={{ padding: '8px 16px', background: 'black', color: 'white', border: 'none' }}>
              {loading ? "submitting" :"Submit"}
            </button>
          </form>
        </div>
      );
    }
    
  

export default form