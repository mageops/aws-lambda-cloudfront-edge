const isError = response => {
    if (typeof response === 'object' && response !== null) {
        return response.statusCode > 299;
    }

    return false;
};

module.exports = {
    isError,
};
