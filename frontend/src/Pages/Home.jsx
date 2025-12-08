import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products from API
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:8000/api/Product');
        if (response.data.success) {
          setProducts(response.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const goToProductDetails = (id) => {
    navigate(`/product_details/${id}`);
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <>
         <Navbar/>
    <div className="home-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Our Products</h1>
      <div className="product-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '20px', 
        marginTop: '20px' 
      }}>
        {products.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => goToProductDetails(product.id)}
            style={{ 
              cursor: 'pointer', 
              border: '1px solid #ddd', 
              borderRadius: '12px', 
              padding: '16px', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}
          >
            {product.images && product.images.length > 0 ? (
              <img
                src={`http://localhost:8000${product.images[0]}`}
                alt={product.name}
                style={{ 
                  width: '100%', 
                  height: '200px', 
                  objectFit: 'cover', 
                  borderRadius: '8px',
                  marginBottom: '12px'
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '200px',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                color: '#999'
              }}>
                No image
              </div>
            )}
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2em' }}>{product.name}</h3>
            <p style={{ 
              fontSize: '1.5em', 
              fontWeight: 'bold', 
              color: '#e74c3c',
              margin: '0 0 12px 0'
            }}>
              ${product.price.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      
      {products.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          No products available at the moment.
        </div>
      )}
    </div>
    </>
   
  );
};

export default Home;
