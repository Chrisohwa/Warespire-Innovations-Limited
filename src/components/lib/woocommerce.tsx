"use client";
import { signOut } from "@utils/lib";
import { WC_ConsumerKey, WC_consumerSecret, WC_URL } from "@utils/lib/data";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import { useMutation, useQuery } from "@tanstack/react-query";

export const WooCommerce = new WooCommerceRestApi({
  url: WC_URL, // Your store URL
  consumerKey: WC_ConsumerKey, // Your consumer key
  consumerSecret: WC_consumerSecret, // Your consumer secret
  version: "wc/v3", // WooCommerce API version
});

export const useCustomer = (customerId: string | undefined) => {
  return useQuery({
    queryKey: ["customer", customerId],
    queryFn: async () => {
      const response = await WooCommerce.get(`customers/${customerId}`);
      return response.data;
    },
    throwOnError: (error: any) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        signOut();
      } else {
        console.error("An error occurred:", error);
      }
      return false;
    },
    staleTime: Infinity,
  });
};

export const useProduct = (productId: string | undefined) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const response = await WooCommerce.get(`products/${productId}`);
      return response.data;
    },
    staleTime: Infinity,
  });
};

export const useCustomerOrders = (customerId: number | string | undefined) => {
  return useQuery({
    queryKey: ["customer-orders", customerId],
    queryFn: async () => {
      if (!customerId) throw new Error("Customer ID is required");

      const response = await WooCommerce.get("orders", {
        customer: customerId,
        per_page: 100,
        order: "desc",
        orderby: "date",
      });

      return response.data;
    },
    enabled: !!customerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

export const useOrders = (
  id?: string,
  page: number = 1,
  perPage: number = 10,
) => {
  return useQuery({
    queryKey: ["order", id, page, perPage],
    queryFn: async () => {
      const endpoint = id
        ? `orders/${id}`
        : `orders?page=${page}&per_page=${perPage}`;
      const response = await WooCommerce.get(endpoint);

      const totalItems = parseInt(response.headers["x-wp-total"], 10);
      const totalPages = parseInt(response.headers["x-wp-totalpages"], 10);

      return {
        data: response.data,
        totalItems,
        totalPages,
      };
    },
    placeholderData: (previousData) => previousData, // replaces keepPreviousData
    refetchOnWindowFocus: true,
    staleTime: Infinity,
  });
};

export const useMediaUpload = () => {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", `Receipt_${Date.now()}`);

      const response = await fetch(`${WC_URL}/wp-json/wp/v2/media`, {
        method: "POST",
        headers: {
          Authorization:
            "Basic " + btoa(`${WC_ConsumerKey}:${WC_consumerSecret}`),
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Media upload failed");
      return await response.json();
    },
  });
};

export const useUpdateOrder = () => {
  return useMutation({
    mutationFn: async ({ orderId, data }: { orderId: number; data: any }) => {
      const response = await WooCommerce.put(`orders/${orderId}`, data);
      return response.data;
    },
  });
};

export const useProductSearch = (query: string | undefined) => {
  return useQuery({
    queryKey: ["product-search", query],
    queryFn: async () => {
      const response = await WooCommerce.get(`products?search=${query}`);
      return response.data;
    },
    staleTime: Infinity,
  });
};

export const useGeneralSettings = () => {
  return useQuery({
    queryKey: ["general-settings"],
    queryFn: async () => {
      const response = await WooCommerce.get("settings/general");
      return response.data;
    },
  });
};

export const useCategories = (categoryId: string | undefined) => {
  return useQuery({
    queryKey: ["categories", categoryId],
    queryFn: async () => {
      const response = await WooCommerce.get(
        `products/categories/${categoryId}`,
      );
      return response.data;
    },
    staleTime: Infinity,
  });
};

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: async (orderData: any) => {
      const response = await WooCommerce.post("orders", orderData);
      return response.data;
    },
  });
};

export const useProductsByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ["category-products", categoryId],
    queryFn: async () => {
      const response = await WooCommerce.get(`products?category=${categoryId}`);
      return response.data;
    },
  });
};

export const useUpdateCustomer = () => {
  return useMutation({
    mutationFn: async (updatedCustomerData: any) => {
      const { id, ...data } = updatedCustomerData;
      const response = await WooCommerce.put(`customers/${id}`, data);
      return response.data;
    },
  });
};
