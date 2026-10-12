/**
 * @file apps/web/src/features/dashboard/api/create-tenant.ts
 * @description TanStack Mutation hook provisioning new workspace tenant identities.
 * @module @devlab/portal-web/features/dashboard/api/create-tenant
 */

import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { api, type Tenant } from "@/lib/api-client";
import { tenantsQueryKey } from "./get-tenants";

interface CreateTenantVariables {
  name: string;
}

/**
 * Mutation hook for provisioning new isolated workspace tenants.
 */
export function useCreateTenantMutation(): UseMutationResult<Tenant, Error, CreateTenantVariables> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name }: CreateTenantVariables) => api.createTenant({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tenantsQueryKey() });
    },
  });
}

export { useCreateTenantMutation as useCreateTenant };
