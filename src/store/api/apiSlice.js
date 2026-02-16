import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://rjj3twnh-3100.asse.devtunnels.ms/api",
  }),
  endpoints: (builder) => ({}),
});
