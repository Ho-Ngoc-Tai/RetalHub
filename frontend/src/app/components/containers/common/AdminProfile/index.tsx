/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { adminProfileAction } from "@stores/reducers/common";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function AdminProfile() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(adminProfileAction());
  }, []);
  return null;
}
