module.exports = {
    isEmail: (value) => {
        const [localPart, domain, ...etc] = value.split('@');

        if (!localPart || !domain || etc.length) {
            return false;
        } else if (value.includes(' ')) {
            return false;
        } else if (value[0] === '-') {
            return false;
        }

        for (const word of localPart.split('')) {
            if (!/^[0-9a-z+_-]+$/gi.test(word)){
                return false;
            }
        }
        for (const word of domain.split('')) {
            if (!/^[0-9a-z-.]+$/gi.test(word)){
                return false;
            }
        }

        // value가 이메일 형식에 맞으면 true, 형식에 맞지 않으면 false를 return 하도록 구현해보세요
        return true;
    },
};