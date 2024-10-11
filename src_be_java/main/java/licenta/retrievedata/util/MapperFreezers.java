package licenta.retrievedata.util;

import licenta.retrievedata.entitites.Device;
import licenta.retrievedata.entitites.RetrievedData;
import java.math.BigDecimal;
import org.springframework.stereotype.Service;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


@Service
public class MapperFreezers {

    public Device convertToDeviceFreezer(RetrievedData retrievedData){
        Device newDevice = new Device();
        newDevice.setName(retrievedData.getTitle());
        newDevice.setCategory(takeCategory(retrievedData.getDescription()));
        newDevice.setPrice(BigDecimal.valueOf(retrievedData.getPrice()));
        newDevice.setUrl(retrievedData.getUrl());
        newDevice.setImageUrl(retrievedData.getImageUrl());
        newDevice.setConsumption(extractEnergyConsumption(retrievedData.getDescription()));
        newDevice.setConsumptionClass(extractConsumptionClass(retrievedData.getTitle()));
        newDevice.setHeight(takeHeight(retrievedData.getDescription()));
        newDevice.setWidth(takeWidth(retrievedData.getDescription()));
        newDevice.setLength(takeLength(retrievedData.getDescription()));
        return newDevice;

    }

    private String extractConsumptionClass(String input){

        String patternString = "Clasa eficienta energetica\\s+([^\n]+)";
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(input);

        if (matcher.find()) {
            return matcher.group(1).trim();
        } else {
            return "invalid clasa";
        }

    }

    private double extractEnergyConsumption (String input){
        String patternStringYearly = "Consum energetic \\(kWh/an\\)\\s+(\\d+\\.?\\d*)";
        String patternStringDaily = "Consum energetic \\(kWh/24h\\)\\s+(\\d+\\.?\\d*)";

        Pattern patternYearly = Pattern.compile(patternStringYearly);
        Matcher matcherYearly = patternYearly.matcher(input);

        if (matcherYearly.find()) {
            return Double.parseDouble(matcherYearly.group(1));
        } else {
            Pattern patternDaily = Pattern.compile(patternStringDaily);
            Matcher matcherDaily = patternDaily.matcher(input);

            if (matcherDaily.find()) {
                return 365*(Double.parseDouble(matcherDaily.group(1)));
            } else {
                return 0.0;
            }
        }

    }

    private String takeCategory(String input){
        String patternString = "Tip aparat frigorific\\s+([^\n]+)";
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(input);

        if (matcher.find()) {
            return matcher.group(1).trim();
        } else {
            return "invalid categorie";
        }
    }

    private Double takeHeight(String input){
        String patternString = "Dimensiuni \\(L x A x I cm\\)\\s+(\\d+\\.?\\d*)\\s*x\\s*(\\d+\\.?\\d*)\\s*x\\s*(\\d+\\.?\\d*)";
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(input);

        if (matcher.find()) {
            return Double.parseDouble(matcher.group(3));
        } else {
            return 0.0;
        }

    }

    private Double takeWidth(String input){
        String patternString = "Dimensiuni \\(L x A x I cm\\)\\s+(\\d+\\.?\\d*)\\s*x\\s*(\\d+\\.?\\d*)\\s*x\\s*(\\d+\\.?\\d*)";
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(input);

        if (matcher.find()) {
            return Double.parseDouble(matcher.group(2));
        } else {
            return 0.0;
        }

    }

    private Double takeLength(String input){
        String patternString = "Dimensiuni \\(L x A x I cm\\)\\s+(\\d+\\.?\\d*)\\s*x\\s*(\\d+\\.?\\d*)\\s*x\\s*(\\d+\\.?\\d*)";
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(input);

        if (matcher.find()) {
            return Double.parseDouble(matcher.group(1));
        } else {
            return 0.0;
        }

    }


}






























