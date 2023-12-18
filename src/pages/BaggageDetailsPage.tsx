// BaggageDetailsPage.tsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import BaggageDetailsComponent from "../components/BaggageDetails/BaggageDetailsComponent";
import Breadcrumbs from "../components/BreadCrumbs/BreadCrumbs";
import { selectBaggageDetails } from "../redux/baggage/baggageDetailsSelectors";
import { getBaggageDetails } from "../redux/baggage/baggageDetailsThunk";
import { AppDispatch } from "../redux/store";
import { setBaggageDetails } from "../redux/baggage/baggageDetailsSlice";

const BaggageDetailsPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const baggageDetails = useSelector(selectBaggageDetails);

  useEffect(() => {
    if (id) {
      dispatch(getBaggageDetails(id));
    }

    return () => {
      dispatch(setBaggageDetails(null));
    };
  }, [dispatch, id]);

  const breadcrumbsPaths = [
    { to: "/", label: "Главная" },
    { to: "/baggage", label: "Список багажей" },
    { to: `/baggage/${id}`, label: "Подробнее о багаже" },
  ];

  return (
    <div>
      <Breadcrumbs paths={breadcrumbsPaths}></Breadcrumbs>
      <BaggageDetailsComponent baggageDetails={baggageDetails} />
    </div>
  );
};

export default BaggageDetailsPage;
