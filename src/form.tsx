import  { useState } from 'react';
import axios from 'axios';
const form = (props:any) => {
  
  
    
      const [formData, setFormData] = useState({
        id: '',
        name: '',
        data: {
          capacity: '',
          color: ''
        }
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
            data: (formData.data.color.length!==0 &&formData.data.capacity.length!==0 )? JSON.stringify(formData.data):null // Ensure it's valid JSON
          };
    
          await axios.post('https://react-charts-backend-production.up.railway.app/api/products', payload);
          setLoading(false);
          props.getProducts();

          alert('Product added successfully!');
          setFormData({
            id: '',
            name: '',
            data: {
              capacity: '',
              color: ''
            }
          })
        } catch (error:any) {
          alert('Error adding product: ' + error.message);
          setLoading(false);
        }
      };
      const handleDataChange = (e:any) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          data: {
            ...prevFormData.data,
            [name]: value
          }
        }));
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
              <label>Color: </label><br />
              <input
                type="text"
                name="color"
                value={formData.data.color}
                onChange={handleDataChange}
                style={{ padding: 8, width: '97%' }}
                
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label>Capacity: </label><br />
              <input
                type="text"
                name="capacity"
                value={formData.data.capacity}
                onChange={handleDataChange}
                style={{ padding: 8, width: '97%' }}
                
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