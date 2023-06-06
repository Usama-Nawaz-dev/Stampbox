import { useContext } from "react";
import Env from "../../api/Env";
import MindAxios from "../../api/MindAxios";
import colors from "../../constant/colors";
import Helper from "../Helper";

const getSupplies = async () => {
  const response = await MindAxios.get(
    Env.paramUrl(`products`, `?is_published=1&productable_type=Supply`)
  );
  //   console.log("response", response);
  if (response?.status == 200) {
    let data = response?.data?.result?.paginated_items?.data;
    return data;
    //   setSuppliesList(response?.data?.result?.paginated_items?.data);
  }
};
const getSales = async () => {
  const response = await MindAxios.get(
    Env.paramUrl(`products`, `?productable_type=StampItem`)
  );
  // console.log("response", response);
  if (response?.status == 200) {
    let data = response?.data?.result?.paginated_items?.data;
    return data;
    //   setSalesList(response?.data?.result?.paginated_items?.data);
  }
};
const getBounties = async () => {
  const response = await MindAxios.get(
    Env.paramUrl(`bounties`, `?status=Active`)
  );
  // console.log("response", response);
  if (response?.status == 200) {
    let data = response?.data?.result?.paginated_items?.data;
    return data;
    //   setBountiesList(response?.data?.result?.paginated_items?.data);
  }
};
const getAuctions = async () => {
  const response = await MindAxios.get(
    Env.paramUrl(`auctions`, `?type=active`)
  );
  // console.log("response", response);
  if (response?.status == 200) {
    let data = response?.data?.result?.paginated_items?.data;
    return data;
    //   setAuctionList(response?.data?.result?.paginated_items?.data);
  }
};
const getTrades = async () => {
  const response = await MindAxios.get(Env.paramUrl(`trades`, `?type=active`));
  // console.log("response", response);
  if (response?.status == 200) {
    let data = response?.data?.result?.paginated_items?.data;
    return data;
    //   setTradesList(response?.data?.result?.paginated_items?.data);
  }
};

const toggleFav = async (itemId, dataList, type, language) => {
  let body = {
    wishable_type: type,
    wishable_id: itemId,
  };
  const response = await MindAxios.post(Env.createUrl("wishlists"), body);
  if (response?.status == 200) {
    let updatedList = dataList.map((item) => {
      if (item.id === itemId) {
        if (item.is_wishable === 1) {
          item.is_wishable = 0;
          Helper.showToastMessage(
            `${type} removed from wishlist`,
            colors.green
          );
        } else {
          item.is_wishable = 1;
          Helper.showToastMessage(`${type} added to wishlist`, colors.green);
        }
      }
      return item;
    });
    return updatedList;
    //   setTradesList(updatedList);
  } else {
    alert(language?.serverError);
  }
};

const toggleBookmark = async (tradeId, tradesList, language) => {
  let body = {
    book_markable_type: "Trade",
    book_markable_id: tradeId,
  };
  const response = await MindAxios.post(Env.createUrl("bookmarks"), body);
  if (response?.status == 200) {
    let updatedList = tradesList.map((item) => {
      if (item.id === tradeId) {
        if (item.is_book_marked === 1) {
          item.is_book_marked = 0;
          Helper.showToastMessage("Trade book mark removed", colors.green);
        } else {
          item.is_book_marked = 1;
          Helper.showToastMessage("Trade book mark added", colors.green);
        }
      }
      return item;
    });
    return updatedList;
    //   setTradesList(updatedList);
  } else {
    alert(language?.serverError);
  }
};

export {
  getSupplies,
  getAuctions,
  getBounties,
  getSales,
  getTrades,
  toggleBookmark,
  toggleFav,
};
