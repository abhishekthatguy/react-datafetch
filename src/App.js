import React, { useEffect, useState } from "react";
import { matchQuery, formatNumber, duplicateCheck } from "./utils";
import logo from "./assets/logo.svg";
import search from "./assets/search.svg";
import "./App.css";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState(null);
  const [isError, setError] = useState(false);
  useEffect(() => getProducts(), []);

  const getProducts = async () => {
    try {
      //fetching all json files into a single array
      let data = await Promise.all([
        fetch(`api/branch1.json`).then((res) => res.json()),
        fetch(`api/branch2.json`).then((res) => res.json()),
        fetch(`api/branch3.json`).then((res) => res.json()),
      ]);

      data = data?.reduce(
        //flatening the array to have single products list
        (acc, curr) => [...acc, ...(curr?.products ? curr?.products : [])],
        [] //initial value
      );
      data = data?.reduce(
        (acc, curr) => {
          const duplicate = acc?.find((item) => duplicateCheck(item, curr));
          // returns first element from accumulator when item and curr product is same

          if (typeof duplicate !== "undefined") {
            //if duplicate found
            return acc?.map((item) => {
              //loops through accumulator
              return item === duplicate // if item is accumulator is same as duplicate item
                ? { ...duplicate, sold: item?.sold + curr?.sold } // adds sold amount of duplicate items
                : item;
            });
          }

          return [...acc, curr]; // if duplicate not found it will add the product to accumulator
        },
        [] //initial value
      );

      setProducts(data);
    } catch (error) {
      setError(error);
    }
  };

  const filteredProducts = products?.filter((product) =>
    matchQuery(product?.name, searchQuery)
  );

  return (
    <React.Fragment>
      <header>
        <img src={logo} alt="wowcher logo" />
      </header>

      <div class="product-list">
        <div className="search-bar">
          <input
            placeholder="search products"
            type="text"
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
          />
          <img alt="Search icon" src={search} />
        </div>

        {filteredProducts?.length ? (
          <table className="product-list-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts
                ?.sort((a, b) => (a?.name > b?.name ? 1 : -1))
                ?.map(({ id, name, sold, unitPrice }) => (
                  <tr key={id}>
                    <td>{name}</td>
                    <td>{formatNumber(sold * unitPrice)}</td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr>
                <td>Total</td>
                <td>
                  {formatNumber(
                    filteredProducts?.reduce(
                      (acc, { sold, unitPrice }) => acc + sold * unitPrice,
                      0
                    )
                  )}
                </td>
              </tr>
            </tfoot>
          </table>
        ) : isError ? (//if api error
          <div className="product-list-no-data">
            <p>Some issue occured. Please try reloading.</p>
          </div>
        ) : (//no. of products is 0
          <div className="product-list-no-match">
            <p>Found no products</p>
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default App;
