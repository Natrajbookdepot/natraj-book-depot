<div className="image-gallery">
  <div className="main-image">
    <img 
      src={product.images[0] || defaultImage} 
      alt={product.title} 
      className="product-main-image"
    />
  </div>
  <div className="thumbnail-gallery">
    {product.images.map((image, index) => (
      <img 
        key={index} 
        src={image} 
        alt={`Thumbnail ${index}`} 
        className="thumbnail-image" 
        onClick={() => setMainImage(image)}
      />
    ))}
  </div>
</div>
