import React, { useEffect, useMemo, useRef } from "react";
import { useFormik } from "formik";
import { isArray, range } from "lodash";
import loadable from "@loadable/component";

import Box from "../../components/Box";
import Flex from "../../components/Flex";
import theme, { responsive } from "../../components/ThemeProvider/theme";

import PerTrash from "./PerTrash";
import Footer from "../Footer";
import diff from "./diff";
import useIsEn from "../useIsEn";
import trashEn from "../trashEn";
import { useSearchParam } from "react-use";

const FilterAndSearch = loadable(() => import("./FilterAndSearch"));

let searched;
let filterApplied;

const Catalogue = ({ data }) => {
  const places = useSearchParam("places");
  const recycleStatus = useSearchParam("recycleStatus");
  const recycleValue = useSearchParam("recycleValue");
  const isEn = useIsEn();
  const { values, handleChange, setFieldValue } = useFormik({
    initialValues: {
      search: "",
      places,
      recycleStatus,
      recycleValue,
    },
  });
  const prevValues = useRef();
  useEffect(() => {
    if (typeof window !== "undefined" && window.ga) {
      if (!searched) {
        window.ga("send", "event", "篩選器", "輸入關鍵字");
        searched = true;
      }
      if (!filterApplied) {
        window.ga("send", "event", "篩選器", "使用篩選器");
        filterApplied = true;
      }
      if (prevValues.current) {
        const lastest = Object.entries(diff(prevValues.current, values));
        lastest.forEach(([key, value]) => {
          if (value && key !== "search") {
            window.ga("send", "event", "篩選器", key, value);
          }
        });
      }
    }

    const newUrl = new URL(window.location);

    Object.entries(values).forEach(([key, value]) => {
      if (key !== "search") {
        if (value) {
          newUrl.searchParams.set(key, value);
        } else {
          newUrl.searchParams.delete(key);
        }
      }
    });
    window.history.replaceState({}, "", newUrl.toString());
    prevValues.current = values;
  }, [values]);

  // const gridRef = useRef()
  const okData = useMemo(() => {
    return data
      ? data.filter((d) => {
          // if (!images[d.name]) console.log(d.name)
          return d.gatsbyImg;
        })
      : [];
  }, [data]);

  const filtered = useMemo(
    () =>
      okData.filter((d) => {
        const isDisabled = Object.keys(values).reduce((res, key) => {
          if (!values[key]) return res;
          if (key === "search" && values[key]) {
            const re = new RegExp(values[key], "gi");
            return (
              res ||
              !(
                re.test(isEn ? trashEn[d.name] : d.name) ||
                (d.synonym && d.synonym.some((s) => re.test(s)))
              )
            );
          }
          return (
            res ||
            !d[key] ||
            !(isArray(d[key])
              ? d[key].includes(String(values[key]))
              : d[key] === values[key])
          );
        }, false);
        return !isDisabled;
      }),
    [values, okData, isEn]
  );

  return (
    <Box bg="gray.100">
      <Box
        position="fixed"
        top={theme.headerHeight}
        left="0"
        right="0"
        bg="white"
        px={responsive("1em", "2em")}
        zIndex="dropdown"
      >
        {useMemo(
          () => (
            <FilterAndSearch
              onChange={handleChange}
              setFieldValue={setFieldValue}
              values={values}
            />
          ),
          [values]
        )}
      </Box>
      <Flex
        pt={responsive("4em", "4.5em", "3.25em")}
        px={responsive("0.5em", "1.5em")}
        flexWrap="wrap"
      >
        {(data ? filtered : range(101)).map((d, i) => (
          <Box key={i} width={responsive(1 / 3, 1 / 4, 1 / 6)}>
            <PerTrash data={typeof d === "object" && d} />
          </Box>
        ))}
      </Flex>
      <Footer noSponsor />
    </Box>
  );
};

export default Catalogue;
