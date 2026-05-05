import ProductDetails from '@/components/pages/web/shop/ProductDetails'

const ProductDetailsPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  return <ProductDetails params={slug} />;
};

export default ProductDetailsPage;