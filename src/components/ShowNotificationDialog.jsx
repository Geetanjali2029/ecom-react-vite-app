
import React, { useState, useEffect } from 'react';

const ShowNotificationDialog = (props) => {

    return (
        <>
            <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-md shadow-md">
            <p className="font-semibold">{props.message}</p>
            </div>
        </>
    );
};

export default ShowNotificationDialog;
