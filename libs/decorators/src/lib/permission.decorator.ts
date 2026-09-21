import { GrantablePermission } from '@common/constants/enums/permission.enum';
import { MetadataKeys } from '@common/constants/common.constant';
import { SetMetadata } from '@nestjs/common';

export const RequiredPermission = (...permissions: GrantablePermission[]) =>
  SetMetadata(MetadataKeys.requiredPermission, permissions);
