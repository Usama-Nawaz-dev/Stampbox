import React, { useCallback, useContext, useEffect, useRef } from "react";
import CustomDrawerContent from "./CustomDrawerContent";
import { ContactStackNavigator, MarketStackNavigator } from "./StackNavigator";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import { StamBox } from "../DashBoard/StamBox";
import { AddItem } from "../DashBoard/AddItem";
import { StampboxMedia } from "../DashBoard/StampboxMedia";
import { useDispatch, useSelector } from "react-redux";
import {
  MyProfile,
  EditProfile,
  ChangePassword,
  MyNetwork,
  MyWishlist,
  AllAlbums,
  AllStamps,
  AllProducts,
  FindUser,
  BuyPlan,
  UserProfile,
  UserNetwork,
  PlanDetailScreen,
  MyTfs,
  SavedSellers,
} from "../Profile";

import {
  TradeScreen,
  ChooseProposal,
  SendProposal,
  UserTradeStamp,
  UserMarket,
} from "../Home/Trading";

import PlaceBid from "../Home/PlaceBid/PlaceBid";
import AddStamps from "../MyStampBox/AddStamps";
import { EditStamps } from "../DashBoard/EditStamp";
import { SharePost, UpdatePost } from "../Home/SharePost";
// import { AllCollections } from "../Home/TopTabs";
import AllCollections from "../Home/TopTabs/MyAlbum/AllCollections/AllCollections";
import GuideScreen from "../Home/TopTabs/MyAlbum/GuideScreen";

import {
  UploadPhoto,
  CreateAuction,
  AuctionStamps,
  TradeShip as AucTradeShip,
  ShipRates as AucShipRates,
  Payment as AucPayment,
} from "../Home/TopTabs/Auctions";
import MyAuctions from "../Home/TopTabs/Auctions/MyAuctions/MyAuctions";
import {
  TradeProposal,
  TradeOffer,
  UploadPicture,
  OfferDetail,
  CreateTrade,
  TradeShip,
  ShipRates,
  Payment,
  OrderDetail,
  EditTrade,
} from "../Home/TopTabs/Trade";
import TradeDetail from "../Home/TopTabs/Trade/TradeDetail/TradeDetail";
import Trade from "../Home/TopTabs/Trade/Trade/Trade";
import {
  MyItems,
  CreateAlbum,
  SelectStamps,
  MySets,
  SetDetail,
  MyLots,
  MyStamps,
  AddToAlbum,
  AlbumStamps,
  BundleStamp,
} from "../Home/TopTabs/MyAlbum";
import AlbumDetails from "../Home/TopTabs/MyAlbum/AlbumDetails/AlbumDetails";
import {
  CreateStore,
  EditStore,
  StoreSupply,
  EditAddress,
  InvoiceDetails,
  PaymentDetails,
  ProductDetail,
  EditSupply,
  StoreStamp,
  EditStoreStamp,
  StoreOrder,
  StampFromAlbum,
  MyOrder,
} from "../Store";
import MyStore from "../Store/MyStore/MyStore";
import { MyCart } from "../Cart/MyCart";

import {
  Bounty,
  BountyOffer,
  UserStamp,
  MarketStamp,
  CreateBounty,
  EditBounty,
  BountyPayment,
} from "../Home/Bounties";

import ChoosePlan from "../Auth/ChoosePlan";

import colors from "../../constant/colors";
import Detail from "../Home/Detail";
import Editor from "../../components/ImageEdit/Editor";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { TradeStamps } from "../Home/TopTabs/Trade/Trade/MyStamps/TradeStamps";

import {
  CreateClub,
  SearchClub,
  ClubDetails,
  ClubInvites,
} from "../Home/TopTabs/Clubs";
import StampboxClubs from "../Home/TopTabs/Clubs/StamboxClubs/StampboxClubs";
import {
  ActivatePayment,
  Buy,
  CoinsBilling,
  CoinsWallet,
  ManagePayment,
  Wallet,
} from "../Wallet";
import { AllFlags, Flagging } from "../Flags";
import {
  AuctionOrders,
  TradeOrders,
  MyOrders,
  Feedback,
  OrderDetail as DrawerOrder,
} from "../DrawerScreen/Orders";
import { CatalogueStackNavigator } from "./GeneralStacks/CatalogueStack";
import { EventStackNavigator } from "./GeneralStacks/EventsStack";
import { FlagDetail } from "../Flags/FlagDetail/FlagDetail";
import { FlagConversation } from "../Flags/FlagConversation/FlagConversation";
import OtherUser from "../OtherUser/UserDetail";
import { BlogStackNavigator } from "./GeneralStacks/BlogStack";
import { PostComment } from "../DrawerScreen/PostComments";
import { ItemStackNavigator } from "./GeneralStacks/MyItemsStack";
import { StampDetail } from "../DashBoard/StampDetail/StampDetail";
import ScanModal from "./../Scan/ScanModal";
import { SettingStackNavigator } from "./GeneralStacks/SettingStack";
import { ShipDetail } from "../Home/TopTabs/Auctions/ShipDetail/ShipDetail";
import { ShippingRate } from "../Home/TopTabs/Auctions/ShipDetail/ShippingRate";
import { PaymentScreen } from "../Home/TopTabs/Auctions/ShipDetail/PaymentScreen";
import {
  ChatScreen,
  CreateGroup,
  GroupChat,
  GroupStackNavigator,
  InfoScreen,
  OnlyUsers,
  Users,
} from "../Chat";
import { MyInventory, MyReports } from "../DrawerScreen";

import {
  EditEvent,
  CreateEvent,
  InviteMember,
  EventDetail,
  BuyTicket,
  CalendarScreen,
  ExhibitionStamps,
} from "../Events";
import Events from "../Events/Events/Events";
import { FeedComments, HomeSearch } from "../Home";
import { CreditCards } from "../Profile/CreditCards";
import {
  PrivacyPolicy,
  CustomerSupport,
  TermsConditionScreen,
} from "../DrawerScreen/Settings";
import SupportStack from "../DrawerScreen/Settings/AccountPreferences/SupportStack";
import { PostDetail, SearchResults } from "../Home";

// import SearchResults from "../Home/SearchResults";
import { Similar } from "../DashBoard/Similar";
import { ForumStackNavigator } from "./GeneralStacks/ForumStack";
import { UserStoreStackNavigator } from "./GeneralStacks/UserStoreStack";
import { ExpertStackNavigator } from "./GeneralStacks/ExpertStack";

const AppDrawer = createDrawerNavigator();
const ProfileStack = createNativeStackNavigator();
const DashBoardStack = createNativeStackNavigator();
const MyAlbumsStack = createNativeStackNavigator();
const StoreStack = createNativeStackNavigator();
const AuctionsStack = createNativeStackNavigator();
const TradeStack = createNativeStackNavigator();
const BountyStack = createNativeStackNavigator();
const TradingStack = createNativeStackNavigator();
const ClubsStack = createNativeStackNavigator();
const WalletStack = createNativeStackNavigator();
const SearchStack = createNativeStackNavigator();
const OrdersStack = createNativeStackNavigator();
const FlagsStack = createNativeStackNavigator();
const GeneralStack = createNativeStackNavigator();
const ProductStack = createNativeStackNavigator();
const PostDetailStack = createNativeStackNavigator();

//Post Detail Stack
const PostDetailNavigator = () => {
  return (
    <PostDetailStack.Navigator>
      <PostDetailStack.Screen
        name="PostDetail"
        component={PostDetail}
        options={{ headerShown: false }}
      />
    </PostDetailStack.Navigator>
  );
};

//Orders Stack
const OrderStackNavigator = () => {
  return (
    <OrdersStack.Navigator>
      <OrdersStack.Screen
        name="AuctionOrders"
        component={AuctionOrders}
        options={{ headerShown: false }}
      />
      <OrdersStack.Screen
        name="TradeOrders"
        component={TradeOrders}
        options={{ headerShown: false }}
      />
      <OrdersStack.Screen
        name="MyOrders"
        component={MyOrders}
        options={{ headerShown: false }}
      />
      <OrdersStack.Screen
        name="OrderDetail"
        component={DrawerOrder}
        options={{ headerShown: false }}
      />
      <OrdersStack.Screen
        name="Feedback"
        component={Feedback}
        options={{ headerShown: false }}
      />
      <OrdersStack.Screen
        name="TradeOrder"
        component={OrderDetail}
        options={{ headerShown: false }}
      />
    </OrdersStack.Navigator>
  );
};

//Clubs Stack
const ClubsStackNavigator = () => {
  return (
    <ClubsStack.Navigator>
      <ClubsStack.Screen
        name="StampboxClubs"
        component={StampboxClubs}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="CreateClub"
        component={CreateClub}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="SearchClub"
        component={SearchClub}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="ClubDetails"
        component={ClubDetails}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="SharePost"
        component={SharePost}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="ClubInvites"
        component={ClubInvites}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="UpdatePost"
        component={UpdatePost}
        options={{ headerShown: false }}
      />

      {/* Product Stack Screen */}
      <ClubsStack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="EditSupply"
        component={EditSupply}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="EditStoreStamp"
        component={EditStoreStamp}
        options={{ headerShown: false }}
      />
      {/* Auction Screens Stack */}
      <ClubsStack.Screen
        name="AuctionDetail"
        component={PlaceBid}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="ShippingRate"
        component={ShippingRate}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="ShipDetails"
        component={ShipDetail}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="ShipRate"
        component={AucShipRates}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="CreateAuction"
        component={CreateAuction}
        options={{ headerShown: false }}
      />

      {/* Trade Stack Screens */}
      <ClubsStack.Screen
        name="TradeDetail"
        component={TradeDetail}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="OfferDetail"
        component={OfferDetail}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="TradeProposal"
        component={TradeProposal}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="TradeOffer"
        component={TradeOffer}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="SendProposal"
        component={SendProposal}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="UserTradeStamp"
        component={UserTradeStamp}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="CounterProposal"
        component={SendProposal}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="TradeStamps"
        component={TradeStamps}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="EditTrade"
        component={EditTrade}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="ChooseProposal"
        component={ChooseProposal}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="UserMarket"
        component={UserMarket}
        options={{ headerShown: false }}
      />

      {/* Bounty Stack Screens */}
      <ClubsStack.Screen
        name="BountyDetail"
        component={Bounty}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="EditBounty"
        component={EditBounty}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="BountyOffer"
        component={BountyOffer}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="BountyPayment"
        component={BountyPayment}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="UserStamp"
        component={UserStamp}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="MarketStamp"
        component={MarketStamp}
        options={{ headerShown: false }}
      />

      <ClubsStack.Screen
        name="Subscriptions"
        component={ChoosePlan}
        options={{ headerShown: false }}
      />

      {/* Event Stack Screens */}
      <ClubsStack.Screen
        name="EventDetail"
        component={EventDetail}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="EditEvent"
        component={EditEvent}
        options={{ headerShown: false }}
      />

      <ClubsStack.Screen
        name="BuyTicket"
        component={BuyTicket}
        options={{ headerShown: false }}
      />

      {/* Common Screens  */}
      <ClubsStack.Screen
        name="StampboxMedia"
        component={StampboxMedia}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="AddItem"
        component={AddItem}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="Flagging"
        component={Flagging}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="PostComment"
        component={PostComment}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="MyNetwork"
        component={MyNetwork}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="UserNetwork"
        component={UserNetwork}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{ headerShown: false }}
      />
      <ClubsStack.Screen
        name="FeedComment"
        component={FeedComments}
        options={{ headerShown: false }}
      />
    </ClubsStack.Navigator>
  );
};
// Search Stack
const SearchStackNavigator = () => {
  return (
    <SearchStack.Navigator>
      <SearchStack.Screen
        name="Search"
        component={HomeSearch}
        options={{ headerShown: false }}
      />
      <SearchStack.Screen
        name="SearchResults"
        component={SearchResults}
        options={{ headerShown: false }}
      />
      <SearchStack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={{ headerShown: false }}
      />
      <SearchStack.Screen
        name="BountyStack"
        component={BountyStackNavigator}
        options={{ headerShown: false }}
      />
      <SearchStack.Screen
        name="TradeStack"
        component={TradeStackNavigator}
        options={{ headerShown: false }}
      />
      <SearchStack.Screen
        name="AuctionStack"
        component={AuctionsStackNavigator}
        options={{ headerShown: false }}
      />
      <SearchStack.Screen
        name="General"
        component={GeneralStackNavigator}
        options={{ headerShown: false }}
      />
    </SearchStack.Navigator>
  );
};

//Wallet Stack
const WalletStackNavigator = () => {
  return (
    <WalletStack.Navigator>
      <WalletStack.Screen
        name="PaymentWallet"
        component={Wallet}
        options={{ headerShown: false }}
      />
      <WalletStack.Screen
        name="CoinsWallet"
        component={CoinsWallet}
        options={{ headerShown: false }}
      />
      <WalletStack.Screen
        name="Wallet"
        component={ManagePayment}
        options={{ headerShown: false }}
      />
      <WalletStack.Screen
        name="Activate"
        component={ActivatePayment}
        options={{ headerShown: false }}
      />
      <WalletStack.Screen
        name="Buy"
        component={Buy}
        options={{ headerShown: false }}
      />
      <WalletStack.Screen
        name="CoinsBilling"
        component={CoinsBilling}
        options={{ headerShown: false }}
      />
    </WalletStack.Navigator>
  );
};

//Flags Stack
const FlagsStackNavigator = () => {
  return (
    <FlagsStack.Navigator>
      <FlagsStack.Screen
        name="AllFlags"
        component={AllFlags}
        options={{ headerShown: false }}
      />
      <FlagsStack.Screen
        name="StampDetail"
        component={StampDetail}
        options={{ headerShown: false }}
      />
      <FlagsStack.Screen
        name="Flagging"
        component={Flagging}
        options={{ headerShown: false }}
      />
      <FlagsStack.Screen
        name="FlagConversation"
        component={FlagConversation}
        options={{ headerShown: false }}
      />
    </FlagsStack.Navigator>
  );
};

//Feed Trade Stack
const TradingStackNavigator = () => {
  return (
    <TradingStack.Navigator>
      <TradingStack.Screen
        name="TradeScreen"
        component={TradeScreen}
        options={{ headerShown: false }}
      />
      <TradingStack.Screen
        name="ChooseProposal"
        component={ChooseProposal}
        options={{ headerShown: false }}
      />
      <TradingStack.Screen
        name="SendProposal"
        component={SendProposal}
        options={{ headerShown: false }}
      />
      <TradingStack.Screen
        name="UserTradeStamp"
        component={UserTradeStamp}
        options={{ headerShown: false }}
      />
      <TradingStack.Screen
        name="UserMarket"
        component={UserMarket}
        options={{ headerShown: false }}
      />
    </TradingStack.Navigator>
  );
};

//Bounty Stack
const BountyStackNavigator = () => {
  return (
    <BountyStack.Navigator>
      <BountyStack.Screen
        name="BountyDetail"
        component={Bounty}
        options={{ headerShown: false }}
      />
      <BountyStack.Screen
        name="EditBounty"
        component={EditBounty}
        options={{ headerShown: false }}
      />
      <BountyStack.Screen
        name="BountyOffer"
        component={BountyOffer}
        options={{ headerShown: false }}
      />
      <BountyStack.Screen
        name="UserStamp"
        component={UserStamp}
        options={{ headerShown: false }}
      />
      <BountyStack.Screen
        name="MarketStamp"
        component={MarketStamp}
        options={{ headerShown: false }}
      />
      <BountyStack.Screen
        name="AddItem"
        component={AddItem}
        options={{ headerShown: false }}
      />
      <BountyStack.Screen
        name="StampboxMedia"
        component={StampboxMedia}
        options={{ headerShown: false }}
      />
      <BountyStack.Screen
        name="Subscriptions"
        component={ChoosePlan}
        options={{ headerShown: false }}
      />
      <BountyStack.Screen
        name="PostComment"
        component={PostComment}
        options={{ headerShown: false }}
      />
      <BountyStack.Screen
        name="BountyPayment"
        component={BountyPayment}
        options={{ headerShown: false }}
      />
      <BountyStack.Screen
        name="StoreStamp"
        component={StoreStamp}
        options={{ headerShown: false }}
      />
    </BountyStack.Navigator>
  );
};

//Trade Stack
const TradeStackNavigator = () => {
  return (
    <TradeStack.Navigator>
      <TradeStack.Screen
        name="Trade"
        component={Trade}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="UploadPicture"
        component={UploadPicture}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="TradeDetail"
        component={TradeDetail}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="OfferDetail"
        component={OfferDetail}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="TradeProposal"
        component={TradeProposal}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="TradeOffer"
        component={TradeOffer}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="SendProposal"
        component={SendProposal}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="UserTradeStamp"
        component={UserTradeStamp}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="CounterProposal"
        component={SendProposal}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="TradeStamps"
        component={TradeStamps}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="CreateTrade"
        component={CreateTrade}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="EditTrade"
        component={EditTrade}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="ShipDetail"
        component={TradeShip}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="OrderDetail"
        component={OrderDetail}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="Feedback"
        component={Feedback}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="ShipRate"
        component={ShipRates}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="TradePayment"
        component={Payment}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="ChooseProposal"
        component={ChooseProposal}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="UserMarket"
        component={UserMarket}
        options={{ headerShown: false }}
      />
      {/* Item Listed Stack Screen */}
      <TradeStack.Screen
        name="AddStamps"
        component={AddStamps}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="StampboxMedia"
        component={StampboxMedia}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="AddItem"
        component={AddItem}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="EditStamps"
        component={EditStamps}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="StampDetail"
        component={StampDetail}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="FlagConversation"
        component={FlagConversation}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="Flagging"
        component={Flagging}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="CreateAuction"
        component={CreateAuction}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="AddToAlbum"
        component={AddToAlbum}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="PostComment"
        component={PostComment}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="OtherUser"
        component={OtherUser}
        options={{ headerShown: false }}
      />
      <TradeStack.Screen
        name="Subscriptions"
        component={ChoosePlan}
        options={{ headerShown: false }}
      />
    </TradeStack.Navigator>
  );
};

//Auctions Stack
const AuctionsStackNavigator = () => {
  return (
    <AuctionsStack.Navigator>
      <AuctionsStack.Screen
        name="My Auctions"
        component={MyAuctions}
        options={{ headerShown: false }}
      />
      <AuctionsStack.Screen
        name="AuctionDetail"
        component={PlaceBid}
        options={{ headerShown: false }}
      />
      <AuctionsStack.Screen
        name="UploadPhoto"
        component={UploadPhoto}
        options={{ headerShown: false }}
      />
      <AuctionsStack.Screen
        name="AuctionStamps"
        component={AuctionStamps}
        options={{ headerShown: false }}
      />
      <AuctionsStack.Screen
        name="CreateAuction"
        component={CreateAuction}
        options={{ headerShown: false }}
      />
      {/* <AuctionsStack.Screen
        name="ShipDetail"
        component={AucTradeShip}
        options={{ headerShown: false }}
      /> */}
      <AuctionsStack.Screen
        name="ShippingRate"
        component={ShippingRate}
        options={{ headerShown: false }}
      />
      <AuctionsStack.Screen
        name="ShipDetails"
        component={ShipDetail}
        options={{ headerShown: false }}
      />
      <AuctionsStack.Screen
        name="ShipRate"
        component={AucShipRates}
        options={{ headerShown: false }}
      />
      <AuctionsStack.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={{ headerShown: false }}
      />

      {/* Album Stack Screens */}
      <AuctionsStack.Screen
        name="CreateAlbum"
        component={CreateAlbum}
        options={{ headerShown: false }}
      />
      <AuctionsStack.Screen
        name="AlbumDetails"
        component={AlbumDetails}
        options={{ headerShown: false }}
      />
      <AuctionsStack.Screen
        name="AlbumStamps"
        component={AlbumStamps}
        options={{ headerShown: false }}
      />

      {/* All Item Stack Screens  */}
      <AuctionsStack.Screen
        name="AddStamps"
        component={AddStamps}
        options={{ headerShown: false }}
      />
      <AuctionsStack.Screen
        name="StampboxMedia"
        component={StampboxMedia}
        options={{ headerShown: false }}
      />
      <AuctionsStack.Screen
        name="AddItem"
        component={AddItem}
        options={{ headerShown: false }}
      />
      <AuctionsStack.Screen
        name="EditStamps"
        component={EditStamps}
        options={{ headerShown: false }}
      />
      <AuctionsStack.Screen
        name="StampDetail"
        component={StampDetail}
        options={{ headerShown: false }}
      />
      <AuctionsStack.Screen
        name="FlagConversation"
        component={FlagConversation}
        options={{ headerShown: false }}
      />
      <AuctionsStack.Screen
        name="Flagging"
        component={Flagging}
        options={{ headerShown: false }}
      />
      <AuctionsStack.Screen
        name="CreateTrade"
        component={CreateTrade}
        options={{ headerShown: false }}
      />
      <AuctionsStack.Screen
        name="AddToAlbum"
        component={AddToAlbum}
        options={{ headerShown: false }}
      />
      <AuctionsStack.Screen
        name="PostComment"
        component={PostComment}
        options={{ headerShown: false }}
      />
      <AuctionsStack.Screen
        name="OtherUser"
        component={OtherUser}
        options={{ headerShown: false }}
      />
      <AuctionsStack.Screen
        name="Subscriptions"
        component={ChoosePlan}
        options={{ headerShown: false }}
      />
    </AuctionsStack.Navigator>
  );
};

//Store Stack

const StoreStackNavigator = () => {
  return (
    <StoreStack.Navigator>
      <StoreStack.Screen
        name="MyStore"
        component={MyStore}
        options={{ headerShown: false }}
      />
      {/* <StoreStack.Screen
        name="CreateStore"
        component={CreateStore}
        options={{ headerShown: false }}
      /> */}
      <StoreStack.Screen
        name="EditStore"
        component={EditStore}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="EditAddress"
        component={EditAddress}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="StoreStamp"
        component={StoreStamp}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="InvoiceDetails"
        component={InvoiceDetails}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="PaymentDetails"
        component={PaymentDetails}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="StoreSupply"
        component={StoreSupply}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="EditSupply"
        component={EditSupply}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="EditStoreStamp"
        component={EditStoreStamp}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="BountyDetail"
        component={Bounty}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="BountyOffer"
        component={BountyOffer}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="UserStamp"
        component={UserStamp}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="MarketStamp"
        component={MarketStamp}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="CreateBounty"
        component={CreateBounty}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="EditBounty"
        component={EditBounty}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="OrderDetail"
        component={StoreOrder}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="MyOrder"
        component={MyOrder}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="StampFromAlbum"
        component={StampFromAlbum}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="BountyPayment"
        component={BountyPayment}
        options={{ headerShown: false }}
      />

      {/* All Item Stack Screens  */}
      <StoreStack.Screen
        name="StampboxMedia"
        component={StampboxMedia}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="AddItem"
        component={AddItem}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="EditStamps"
        component={EditStamps}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="StampDetail"
        component={StampDetail}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="FlagConversation"
        component={FlagConversation}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="Flagging"
        component={Flagging}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="CreateAuction"
        component={CreateAuction}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="CreateTrade"
        component={CreateTrade}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="AddToAlbum"
        component={AddToAlbum}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="PostComment"
        component={PostComment}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="OtherUser"
        component={OtherUser}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="Subscriptions"
        component={ChoosePlan}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="PlanDetail"
        component={PlanDetailScreen}
        options={{ headerShown: false }}
      />
      <StoreStack.Screen
        name="BuyPlan"
        component={BuyPlan}
        options={{ headerShown: false }}
      />
    </StoreStack.Navigator>
  );
};

//Product Stack
export const ProductStackNavigator = () => {
  return (
    <ProductStack.Navigator>
      <ProductStack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={{ headerShown: false }}
      />
      <ProductStack.Screen
        name="EditSupply"
        component={EditSupply}
        options={{ headerShown: false }}
      />
      <ProductStack.Screen
        name="EditStoreStamp"
        component={EditStoreStamp}
        options={{ headerShown: false }}
      />

      {/* All Item Stack Screens  */}
      <ProductStack.Screen
        name="StampboxMedia"
        component={StampboxMedia}
        options={{ headerShown: false }}
      />
      <ProductStack.Screen
        name="AddItem"
        component={AddItem}
        options={{ headerShown: false }}
      />
    </ProductStack.Navigator>
  );
};

//My Albums Stack
const MyAlbumsStackNavigator = () => {
  return (
    <MyAlbumsStack.Navigator>
      <MyAlbumsStack.Screen
        name="AllCollections"
        component={AllCollections}
        options={{ headerShown: false }}
      />
      <MyAlbumsStack.Screen
        name="GuideScreen"
        component={GuideScreen}
        options={{ headerShown: false }}
      />
      <MyAlbumsStack.Screen
        name="CreateAlbum"
        component={CreateAlbum}
        options={{ headerShown: false }}
      />
      <MyAlbumsStack.Screen
        name="MyItems"
        component={MyItems}
        options={{ headerShown: false }}
      />
      <MyAlbumsStack.Screen
        name="SelectStamps"
        component={SelectStamps}
        options={{ headerShown: false }}
      />
      <MyAlbumsStack.Screen
        name="AlbumDetails"
        component={AlbumDetails}
        options={{ headerShown: false }}
      />
      <MyAlbumsStack.Screen
        name="BundleStamp"
        component={BundleStamp}
        options={{ headerShown: false }}
      />
      <MyAlbumsStack.Screen
        name="MySets"
        component={MySets}
        options={{ headerShown: false }}
      />
      <MyAlbumsStack.Screen
        name="SetDetail"
        component={SetDetail}
        options={{ headerShown: false }}
      />
      <MyAlbumsStack.Screen
        name="MyLots"
        component={MyLots}
        options={{ headerShown: false }}
      />
      <MyAlbumsStack.Screen
        name="MyStamps"
        component={MyStamps}
        options={{ headerShown: false }}
      />
      {/* Item Listed Stack Screen */}
      <MyAlbumsStack.Screen
        name="AddStamps"
        component={AddStamps}
        options={{ headerShown: false }}
      />
      <MyAlbumsStack.Screen
        name="StampboxMedia"
        component={StampboxMedia}
        options={{ headerShown: false }}
      />
      <MyAlbumsStack.Screen
        name="AddItem"
        component={AddItem}
        options={{ headerShown: false }}
      />
      <MyAlbumsStack.Screen
        name="EditStamps"
        component={EditStamps}
        options={{ headerShown: false }}
      />
      <MyAlbumsStack.Screen
        name="StampDetail"
        component={StampDetail}
        options={{ headerShown: false }}
      />
      <MyAlbumsStack.Screen
        name="FlagConversation"
        component={FlagConversation}
        options={{ headerShown: false }}
      />
      <MyAlbumsStack.Screen
        name="Flagging"
        component={Flagging}
        options={{ headerShown: false }}
      />
      <MyAlbumsStack.Screen
        name="CreateAuction"
        component={CreateAuction}
        options={{ headerShown: false }}
      />
      <MyAlbumsStack.Screen
        name="CreateTrade"
        component={CreateTrade}
        options={{ headerShown: false }}
      />
      <MyAlbumsStack.Screen
        name="AddToAlbum"
        component={AddToAlbum}
        options={{ headerShown: false }}
      />
      <MyAlbumsStack.Screen
        name="AlbumStamps"
        component={AlbumStamps}
        options={{ headerShown: false }}
      />
      <MyAlbumsStack.Screen
        name="PostComment"
        component={PostComment}
        options={{ headerShown: false }}
      />
    </MyAlbumsStack.Navigator>
  );
};

//Profile Stack
const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="MyProfile"
        component={MyProfile}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="MyTfs"
        component={MyTfs}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="SavedSellers"
        component={SavedSellers}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="Subscriptions"
        component={ChoosePlan}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="BuyPlan"
        component={BuyPlan}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="CreditCards"
        component={CreditCards}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="PlanDetail"
        component={PlanDetailScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="MyNetwork"
        component={MyNetwork}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="UserNetwork"
        component={UserNetwork}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="MyWishlist"
        component={MyWishlist}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="AllAlbums"
        component={AllAlbums}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="AllStamps"
        component={AllStamps}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="AllProducts"
        component={AllProducts}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="FindUser"
        component={FindUser}
        options={{ headerShown: false }}
      />

      {/* Album Stack Screens */}
      <ProfileStack.Screen
        name="AllCollections"
        component={AllCollections}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="CreateAlbum"
        component={CreateAlbum}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="MyItems"
        component={MyItems}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="BundleStamp"
        component={BundleStamp}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="SelectStamps"
        component={SelectStamps}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="AlbumDetails"
        component={AlbumDetails}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="MyStamps"
        component={MyStamps}
        options={{ headerShown: false }}
      />
      {/* Item Listed Stack Screen */}
      <ProfileStack.Screen
        name="AddStamps"
        component={AddStamps}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="StampboxMedia"
        component={StampboxMedia}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="AddItem"
        component={AddItem}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="EditStamps"
        component={EditStamps}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="StampDetail"
        component={StampDetail}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="FlagConversation"
        component={FlagConversation}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="Flagging"
        component={Flagging}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="CreateAuction"
        component={CreateAuction}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="CreateTrade"
        component={CreateTrade}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="AddToAlbum"
        component={AddToAlbum}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="AlbumStamps"
        component={AlbumStamps}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="PostComment"
        component={PostComment}
        options={{ headerShown: false }}
      />
      {/* Product Detail Screens */}
      <ProfileStack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={{ headerShown: false }}
      />
    </ProfileStack.Navigator>
  );
};

//General Stack
const GeneralStackNavigator = () => {
  const initialRoute = useSelector((state) => state.SheetReducer.initialRoute);
  return (
    <GeneralStack.Navigator
      initialRouteName={initialRoute ? initialRoute : "MyProfile"}
    >
      <GeneralStack.Screen
        name="MyProfile"
        component={MyProfile}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="MyTfs"
        component={MyTfs}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="SavedSellers"
        component={SavedSellers}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="Subscriptions"
        component={ChoosePlan}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="CreditCards"
        component={CreditCards}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="PlanDetail"
        component={PlanDetailScreen}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="BuyPlan"
        component={BuyPlan}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="MyNetwork"
        component={MyNetwork}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="UserNetwork"
        component={UserNetwork}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="MyWishlist"
        component={MyWishlist}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="AllAlbums"
        component={AllAlbums}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="AllStamps"
        component={AllStamps}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="AllProducts"
        component={AllProducts}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="FindUser"
        component={FindUser}
        options={{ headerShown: false }}
      />
      {/* Album Stack Screens */}
      <GeneralStack.Screen
        name="AllCollections"
        component={AllCollections}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="GuideScreen"
        component={GuideScreen}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="CreateAlbum"
        component={CreateAlbum}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="MyItems"
        component={MyItems}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="Trade_Stack"
        component={TradeStackNavigator}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="Auction_Stack"
        component={AuctionsStackNavigator}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="MyItem_Stack"
        component={ItemStackNavigator}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="BundleStamp"
        component={BundleStamp}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="SelectStamps"
        component={SelectStamps}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="AlbumDetails"
        component={AlbumDetails}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="MySets"
        component={MySets}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="SetDetail"
        component={SetDetail}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="MyLots"
        component={MyLots}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="MyStamps"
        component={MyStamps}
        options={{ headerShown: false }}
      />
      {/* Item Listed Stack Screen */}
      <GeneralStack.Screen
        name="AddStamps"
        component={AddStamps}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="StampboxMedia"
        component={StampboxMedia}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="AddItem"
        component={AddItem}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="EditStamps"
        component={EditStamps}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="StampDetail"
        component={StampDetail}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="FlagConversation"
        component={FlagConversation}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="Flagging"
        component={Flagging}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="CreateAuction"
        component={CreateAuction}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="CreateTrade"
        component={CreateTrade}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="AddToAlbum"
        component={AddToAlbum}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="AlbumStamps"
        component={AlbumStamps}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="PostComment"
        component={PostComment}
        options={{ headerShown: false }}
      />
      {/* Product Detail Screens */}
      <GeneralStack.Screen
        name="ProductDetail"
        component={ProductDetail}
        options={{ headerShown: false }}
      />

      {/* Event Stack Screens */}
      <GeneralStack.Screen
        name="Events"
        component={Events}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="CreateEvent"
        component={CreateEvent}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="EventDetail"
        component={EventDetail}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="EditEvent"
        component={EditEvent}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="InviteMember"
        component={InviteMember}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="BuyTicket"
        component={BuyTicket}
        options={{ headerShown: false }}
      />
      <GeneralStack.Screen
        name="ExhibitionStamps"
        component={ExhibitionStamps}
        options={{ headerShown: false }}
      />
    </GeneralStack.Navigator>
  );
};

//Dash Board Stack
const DashboardStackNavigator = () => {
  return (
    <DashBoardStack.Navigator>
      <DashBoardStack.Screen
        name="StamBox"
        component={StamBox}
        options={{ headerShown: false }}
      />
      <DashBoardStack.Screen
        name="Similar"
        component={Similar}
        options={{ headerShown: false }}
      />
      <DashBoardStack.Screen
        name="AddItem"
        component={AddItem}
        options={{ headerShown: false }}
      />
      <DashBoardStack.Screen
        name="AddStamps"
        component={AddStamps}
        options={{ headerShown: false }}
      />
      <DashBoardStack.Screen
        name="EditImage"
        component={Editor}
        options={{ headerShown: false }}
      />
      <DashBoardStack.Screen
        name="StampboxMedia"
        component={StampboxMedia}
        options={{ headerShown: false }}
      />
      <DashBoardStack.Screen
        name="EditStamps"
        component={EditStamps}
        options={{ headerShown: false }}
      />
      <DashBoardStack.Screen
        name="StoreSupply"
        component={StoreSupply}
        options={{ headerShown: false }}
      />
    </DashBoardStack.Navigator>
  );
};
const DrawerNavigator = () => {
  const check = true;
  return (
    <AppDrawer.Navigator
      // edgeWidth={0}
      screenOptions={{ drawerStyle: { backgroundColor: colors.white } }}
      initialRouteName="AppTabs"
      useNativeAnimations={true}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <AppDrawer.Screen
        name="Home"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="Market"
        component={MarketStackNavigator}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="GeneralStack"
        component={GeneralStackNavigator}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="ShipDetails"
        component={ShipDetail}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="ShippingRate"
        component={ShippingRate}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="StamBox"
        component={DashboardStackNavigator}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="ProfileStack"
        component={ProfileStackNavigator}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="TradingStack"
        component={TradingStackNavigator}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="ProductStack"
        options={{ headerShown: false }}
        component={ProductStackNavigator}
      />
      <AppDrawer.Screen
        name="BountyStack"
        component={BountyStackNavigator}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="HomeDetail"
        component={Detail}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="SettingStack"
        component={SettingStackNavigator}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="BlogStack"
        component={BlogStackNavigator}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="ExpertStack"
        component={ExpertStackNavigator}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="PostComment"
        component={PostComment}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="FeedComment"
        component={FeedComments}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="SharePost"
        component={SharePost}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="UpdatePost"
        component={UpdatePost}
        options={{ headerShown: false }}
      />
      {/* Album Stack */}
      <AppDrawer.Screen
        name="AlbumStack"
        component={MyAlbumsStackNavigator}
        options={{ headerShown: false }}
      />
      {/* Create Store Screen */}
      <AppDrawer.Screen
        name="CreateStore"
        component={CreateStore}
        options={{ headerShown: false }}
      />
      {/* Store Stack */}
      <AppDrawer.Screen
        name="MyStoreStack"
        component={StoreStackNavigator}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="AuctionStack"
        component={AuctionsStackNavigator}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="TradeStack"
        component={TradeStackNavigator}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="ClubsStack"
        component={ClubsStackNavigator}
        options={{ headerShown: false }}
      />
      {/* Wallet Stack */}
      <AppDrawer.Screen
        name="MainFlags"
        component={FlagsStackNavigator}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="OtherUser"
        component={OtherUser}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="ScanModal"
        component={ScanModal}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="Flagging"
        component={Flagging}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="FlagConversation"
        component={FlagConversation}
        options={{ headerShown: false }}
      />
      {/* Search Stack */}

      <AppDrawer.Screen
        name="HomeSearch"
        component={SearchStackNavigator}
        options={{ headerShown: false }}
      />
      {/* Wallet Stack */}
      <AppDrawer.Screen
        name="MainWallet"
        component={WalletStackNavigator}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="CoinsWallet"
        component={CoinsWallet}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="MyNetwork"
        component={MyNetwork}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="FindUser"
        component={FindUser}
        options={{ headerShown: false }}
      />
      {/* Drawer Order Stack */}
      <AppDrawer.Screen
        name="OrderStack"
        component={OrderStackNavigator}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="MyCart"
        component={MyCart}
        options={{ headerShown: false }}
      />
      {/* Catalogue Stack */}
      <AppDrawer.Screen
        name="CatalogueStack"
        component={CatalogueStackNavigator}
        options={{ headerShown: false }}
      />
      {/* Chat Stack */}
      <AppDrawer.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ headerShown: false }}
      />

      <AppDrawer.Screen
        name="GroupStack"
        component={GroupStackNavigator}
        options={{ headerShown: false }}
      />

      {/* Add Users to create group */}
      <AppDrawer.Screen
        name="AddUsers"
        component={Users}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="OnlyUsers"
        component={OnlyUsers}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="CreateGroup"
        component={CreateGroup}
        options={{ headerShown: false }}
      />
      {/* Events Stack */}
      {/* <AppDrawer.Screen
        name="EventStack"
        component={EventStackNavigator}
        options={{ headerShown: false }}
      /> */}
      <AppDrawer.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={{ headerShown: false }}
      />
      {/* My Items Stack */}
      <AppDrawer.Screen
        name="MyItemStack"
        component={ItemStackNavigator}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="Subscriptions"
        component={ChoosePlan}
        options={{ headerShown: false }}
      />
      {/* Inventory Screen */}
      <AppDrawer.Screen
        name="MyInventory"
        component={MyInventory}
        options={{ headerShown: false }}
      />
      {/* Report Screen */}
      <AppDrawer.Screen
        name="MyReports"
        component={MyReports}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="Terms"
        component={TermsConditionScreen}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="CustomerSupport"
        component={SupportStack}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="OrderDetail"
        component={DrawerOrder}
        options={{ headerShown: false }}
      />
      <AppDrawer.Screen
        name="ForumStack"
        component={ForumStackNavigator}
        options={{ headerShown: false }}
      />

      {/* User Store Stack */}
      <AppDrawer.Screen
        name="UserStore"
        component={UserStoreStackNavigator}
        options={{ headerShown: false }}
      />
    </AppDrawer.Navigator>
  );
};

export { DrawerNavigator, StoreStackNavigator, GeneralStackNavigator };
