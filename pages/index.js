import { Alert, CircularProgress, Grid } from '@mui/material';
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import client from '../utils/client';
import ProductItem from '../components/productItem';
// import product from '../sanity/schemas/product';

export default function Home() {
  const [state, setState] = useState({
    products: [],
    error: '',
    loading: true,
  });
  const { loading, error, products } = state;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await client.fetch(`*[_type == "product"]`);
        setState({ products, loading: false });
      } catch (err) {
        setState({ loading: false, error: err.message });
      }
    };
    fetchData();
  }, []);
  return (
    <Layout>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item md={4} key={product.slug}>
              <ProductItem product={product}></ProductItem>
            </Grid>
          ))}
        </Grid>
      )}
    </Layout>
  );
}
