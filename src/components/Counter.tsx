import { useState } from "react";

function Counter () {

    interface Record {
        date: string;
        distance: string;
        ts: number
    };

    interface FormData {
        date: string;
        distance:  string;
      };

    const checkDate = (dateString: string) => {

        if (((+dateString[0] === 3) && +dateString[1] > 1) || +dateString[0] > 3 || +dateString[3] > 1) {
            console.log('Non valid date');
            return false;
        };        

        return true;
    };

    const [formData, setFormData] = useState<FormData>({
        date: '',
        distance: ''
      });

    const records: Record[] = [];

    const [currRecords, setRecords] = useState(records);

    const [errMessage, setErrMessage] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        console.log('Form Data: ', formData);

        //const { name, value } = event.target;

        if (formData.date === '' || formData.distance === '') {
            setErrMessage('Fill all fields!');
            return;
        };

        const validDate = checkDate(formData.date);
        
        if (!validDate) {
            setErrMessage('Non valid date!');
            return;                
        }

        const [day, month, year] = formData.date.split('.');
        console.log('DAY type: ', typeof day);
        //const dateObject = new Date(`20${year}`, month - 1, day);
        const dateObject = new Date(2000 + +year, +month - 1, +day);
        const timestamp = dateObject.getTime();

        const newRecord: Record = {

            date: formData.date,
            distance: formData.distance,
            ts: timestamp
        };

        setRecords(prevRecords => {
            
            const recs: Record[] = [...prevRecords];

            recs.push(newRecord);
            recs.sort((a, b) => {
                if(a.ts > b.ts) {
                    return-1;
                }

                return 1;
            });

            return recs;

        });

        setErrMessage('');

        setFormData(
            {
                date: '',
                distance: ''
              }
        );

    };

    const deleteItem = (id: number): void => {
        setRecords(currRecords => {
            return currRecords.filter(rec => rec.ts !== id);
        })
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
          ...formData,
          [event.target.name]: event.target.value,
        });

      };

    return (
        <>
        <div className="counter">
            <p>{errMessage}</p>
            <form onSubmit={handleSubmit}>
            <fieldset>
                    <legend>Date (dd.mm.yy)</legend>
                    <input
                    type="text"
                    name="date"
                    id="date"
                    placeholder="Enter date"
                    value={formData.date}
                    onChange={handleChange}
                    />
                </fieldset>

                <fieldset>
                    <legend>Walked km</legend>
                    <input
                    type="text"
                    name="distance"
                    id="distance"
                    placeholder="Enter distance"
                    value={formData.distance}
                    onChange={handleChange}
                    />
                </fieldset>
                <button type="submit">OK</button>
            </form>

            <ol className="records">
                {currRecords.map((rec, index) => {
                    return (
                        <li key={index}>{rec.date}{' | '}{rec.distance}{' | '}<button type="button" className="delBtn" onClick={() => deleteItem(rec.ts)}>x</button></li>
                    )
                })}
            </ol>
        </div>
        </>
    )

};

export default Counter;