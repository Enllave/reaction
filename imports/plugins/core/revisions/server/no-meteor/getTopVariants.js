import findRevision from "./findRevision";

/**
 * TODO
 * @method
 * @summary
 * @param
 * @param
 * @return
 */
export default async function getTopVariants(productId, collections) {
  const { Products } = collections;
  const variants = [];

  const products = await Products.find({
    ancestors: [productId],
    type: "variant",
    isDeleted: false
  }).toArray();

  await Promise.all(
    products.map(async (product) => {
      const revision = await findRevision(
        {
          documentId: product._id
        },
        collections
      );

      if (revision && revision.documentData.isVisible) {
        variants.push(revision.documentData);
      } else if (!revision && product.isVisible) {
        variants.push(product);
      }

      return variants;
    })
  );

  return variants;
}