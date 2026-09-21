import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { MetadataKeys } from '@common/constants/common.constant';

export const Authorization = (params?: { secured: boolean }) => {
  const secured = params?.secured ?? true;
  if (secured) {
    return applyDecorators(ApiBearerAuth(), SetMetadata(MetadataKeys.secured, secured));
  }

  return SetMetadata(MetadataKeys.secured, secured);
};
