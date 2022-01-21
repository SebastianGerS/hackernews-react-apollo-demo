import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { LINKS_PER_PAGE } from "../constants";
import { FEED_QUERY } from "./LinkList";

const CREATE_LINK_MUTATION = gql`
    mutation postMutation(
        $description: String!
        $url: String!
    ) {
        createLink(description: $description, url: $url) {
            id
            createdAt
            url
            description
        }
    }
`;

const CreateLink = () => {
    const navigate = useNavigate();
    const [formState, setFormState] = useState({
        description: '',
        url: ''
    });

    const [createLink] = useMutation(CREATE_LINK_MUTATION, {
        variables: {
            description: formState.description, 
            url: formState.url
        },
        update: (cache, {data: {post}}) => {
            const take = LINKS_PER_PAGE;
            const skip = 0;
            const orderBy = {createdAt: 'desc'};

            const data = cache.readQuery({
                query: FEED_QUERY,
                variables: {
                    take,
                    skip,
                    orderBy
                }
            });

            cache.writeQuery({
                query: FEED_QUERY,
                data: {
                    feed: {
                        links: [post, ...data.feed.links]
                    }
                },
                variables: {
                    take,
                    skip,
                    orderBy
                }
            });
        },
        onCompleted: () => navigate('/new/1')
    });

    return (
        <div>
            <form 
                onSubmit={(e) => {
                    e.preventDefault();
                    createLink();
                }}
            >
                <div className="flex flex-colum mt3">
                    <input 
                        type="text"
                        className="mb2"
                        value={formState.description}
                        onChange={(e) => {
                            setFormState({ 
                                ...formState,
                                description: e.target.value
                            })
                        }}
                        placeholder="A description for the link" 
                    />
                    <input 
                        type="text"
                        className="mb2"
                        value={formState.url}
                        onChange={(e) => {
                            setFormState({ 
                                ...formState,
                                url: e.target.value
                            })
                        }}
                        placeholder="The Url for the link" 
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CreateLink;