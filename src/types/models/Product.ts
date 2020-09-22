import { objectType } from '@nexus/schema';
import { tmpdir } from 'os';

export const Product = objectType({
  name: 'Product',
  definition(t) {
    t.model.id();
    t.model.names();
    t.model.images();
    t.model.preferrers();
    t.model.branches();
    t.model.tags();
    t.model.posts();
    t.model.description();
    t.model.instaText();
    t.model.price();
    t.model.externalLink();
    t.model.videos();
    t.model.views();
    t.model.priority();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

export const ProductName = objectType({
  name: 'ProductName',
  definition(t) {
    t.model.id();
    t.model.productId();
    t.model.Product();
    t.model.lang();
    t.model.word();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

export const ProductImage = objectType({
  name: 'ProductImage',
  definition(t) {
    t.model.id();
    t.model.productId();
    t.model.Product();
    t.model.url();
    t.model.order();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

export const ProductVideo = objectType({
  name: 'ProductVideo',
  definition(t) {
    t.model.id();
    t.model.productId();
    t.model.Product();
    t.model.url();
    t.model.order();
    t.model.isYoutube();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

export const ProductExternalLink = objectType({
  name: 'ProductExternalLink',
  definition(t) {
    t.model.id();
    t.model.url();
    t.model.order();
    t.model.linkType();
    t.model.productId();
    t.model.Product();
    t.model.createdAt();
    t.model.updatedAt();
  },
});
