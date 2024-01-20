import React, { useEffect, useRef } from "react";
import {
  Navbar,
  Container,
  Form,
  FormControl,
  Dropdown,
} from "react-bootstrap";
import styles from "./NavbarDelivery.module.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setsearchFlightNumber,
  setStartFormationDate,
  setEndFormationDate,
  setDeliveryStatus,
  setOwnerName,
} from "../../redux/delivery/deliveryListSlice";
import debounce from "lodash/debounce";
import {
  selectDeliveryStatus,
  selectEndFormationDate,
  selectOwnerName,
  selectStartFormationDate,
  selectsearchFlightNumber,
} from "../../redux/delivery/deliveryListSelectors";
import { setFlightNumber } from "../../redux/delivery/deliveryDetailsSlice";
import { selectisAdmin } from "../../redux/additional/additionalSelectors";

interface NavbarDeliveryProps {}

const NavbarDelivery: React.FC<NavbarDeliveryProps> = () => {
  const dispatch = useDispatch();

  // Используем селекторы из редакса
  // const flightNumber = useSelector(selectsearchFlightNumber);
  const ownerName = useSelector(selectOwnerName);
  const startDate = useSelector(selectStartFormationDate);
  const endDate = useSelector(selectEndFormationDate);
  const status = useSelector(selectDeliveryStatus);
  const isAdmin = useSelector(selectisAdmin);
  const inputRef = useRef<string | null>(null);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    dispatch(setStartFormationDate(newStartDate || null));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    dispatch(setEndFormationDate(newEndDate || null));
  };

  const handleStatusChange = (selectedStatus: string) => {
    if (selectedStatus === "Выберите статус") {
      dispatch(setDeliveryStatus(null));
    } else {
      dispatch(setDeliveryStatus(selectedStatus));
    }
  };

  // const handleSearch = debounce(() => {
  //   const currentValue = inputRef.current;
  //   if (currentValue && currentValue.trim() !== "") {
  //     dispatch(setOwnerName(currentValue.trim()));
  //   }
  // }, 1200);
  const handleSearch = () => {
    const currentValue = inputRef.current;
    console.log("Current value in handleSearch:", currentValue);
    if (currentValue && currentValue !== "") {
      console.log("Value to be dispatched:", currentValue);
      dispatch(setOwnerName(currentValue));
    }
  };

  useEffect(() => {
    handleSearch();
  }, [ownerName, startDate, endDate, status]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //console.log("Input value before setting ref:", e.target.value);
    inputRef.current = e.target.value;
    //console.log("Input value after setting ref:", inputRef.current);
    handleSearch();
  };

  const handleClearSearch = () => {
    dispatch(setOwnerName(""));
    inputRef.current = ""; // Добавим эту строку для сброса ref при очистке поиска
    //dispatch(setFlightNumber(""));
  };

  return (
    <Navbar className={styles.navbar}>
      <Container>
        <Form className={styles.form}>
          {isAdmin && (
            <FormControl
              type="search"
              placeholder="ФИО создателя"
              className={`${styles.searchOwner}`}
              value={ownerName || ""}
              onChange={handleInputChange}
              onInput={(e) => {
                if (!e.currentTarget.value && e.currentTarget.value !== " ") {
                  handleClearSearch();
                }
              }}
            />
          )}
          <FormControl
            type="date"
            placeholder="Дата начала"
            className={`${styles.searchInput} ${styles.datePicker}`}
            value={startDate || ""}
            onChange={handleStartDateChange}
          />
          <FormControl
            type="date"
            placeholder="Дата конца"
            className={`${styles.searchInput} ${styles.datePicker}`}
            value={endDate || ""}
            onChange={handleEndDateChange}
          />
          <Dropdown className={styles.dropdown}>
            <Dropdown.Toggle
              variant="outline-secondary"
              id="dropdown-basic"
              className={styles.dropdownToggle}
            >
              {status || "Выберите статус"}
            </Dropdown.Toggle>
            <Dropdown.Menu className={styles.dropdownContent}>
              {["в работе", "отклонен", "завершен"].map((s) => (
                <Dropdown.Item
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={styles.dropdownItem}
                >
                  {s}
                </Dropdown.Item>
              ))}
              {status &&
                ["в работе", "отклонен", "завершен"].includes(status) && (
                  <Dropdown.Item
                    key="Выберите статус"
                    onClick={() => handleStatusChange("Выберите статус")}
                    className={styles.dropdownItem}
                  >
                    Выберите статус
                  </Dropdown.Item>
                )}
            </Dropdown.Menu>
          </Dropdown>
        </Form>
      </Container>
    </Navbar>
  );
};

export default NavbarDelivery;
