import { objectType } from '@nexus/schema';

export const Branch = objectType({
  name: 'Branch',
  definition(t) {
    t.model.id();
    t.model.shopId();
    t.model.Shop();
    t.model.names();
    t.model.logoUrl();
    t.model.phoneNumbers();
    t.model.products();
    t.model.address();
    t.model.googleMapUrl();
    t.model.longitude();
    t.model.latitude();
    t.model.tags();
    t.model.createdAt();
    t.model.updatedAt();
  },
});

export const BranchName = objectType({
  name: 'BranchName',
  definition(t) {
    t.model.id();
    t.model.branchId();
    t.model.Branch();
    t.model.lang();
    t.model.word();
    t.model.createdAt();
    t.model.updatedAt();
  },
});
