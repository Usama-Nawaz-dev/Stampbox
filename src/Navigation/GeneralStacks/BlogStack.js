import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Blogs, BlogDetail, CreateBlog } from '../../DrawerScreen/Blogs'
import { PostComment } from '../../DrawerScreen/PostComments';
import { AddItem } from '../../DashBoard/AddItem/AddItem';
import { StampboxMedia } from '../../DashBoard/StampboxMedia';


const BlogStack = createNativeStackNavigator();

export const BlogStackNavigator = () => {
    return (
        <BlogStack.Navigator>
            <BlogStack.Screen
                name="Blogs"
                component={Blogs}
                options={{ headerShown: false }}
            />
            <BlogStack.Screen
                name="BlogDetail"
                component={BlogDetail}
                options={{ headerShown: false }}
            />
            <BlogStack.Screen
                name="PostComment"
                component={PostComment}
                options={{ headerShown: false }}
            />
            <BlogStack.Screen
                name="CreateBlog"
                component={CreateBlog}
                options={{ headerShown: false }}
            />
            <BlogStack.Screen
                name="AddItem"
                component={AddItem}
                options={{ headerShown: false }}
            />
            <BlogStack.Screen
                name="StampboxMedia"
                component={StampboxMedia}
                options={{ headerShown: false }}
            />
            
        </BlogStack.Navigator>
    );
};