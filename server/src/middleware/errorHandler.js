module.exports = (err, req, res, next) => {
    console.error('❌', err.message, err.errors || '');

    // Sequelize validation / unique constraint — return field-level details
    if (
        err.name === 'SequelizeValidationError' ||
        err.name === 'SequelizeUniqueConstraintError'
    ) {
        const details = err.errors?.map(e => ({
            field: e.path,
            message: e.message,
            value: e.value,
        }));
        return res.status(422).json({ error: 'Validation error', details });
    }

    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Internal server error' });
};
